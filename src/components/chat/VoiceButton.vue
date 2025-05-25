<template>
  <button
    class="voice-btn"
    @click="handleClick"
    :style="{
      backgroundImage: `url('${buttonImage}')`,
      backgroundSize: buttonSize,
    }"
  />
</template>

<script setup lang="ts">
//必须引入的Recorder核心（文件路径是 /src/recorder-core.js 下同），使用import、require都行
import Recorder from 'recorder-core' //注意如果未引用Recorder变量，可能编译时会被优化删除（如vue3 tree-shaking），请改成 import 'recorder-core'，或随便调用一下 Recorder.a=1 保证强引用
import 'recorder-core'
Recorder.a = 1

//必须引入的RecordApp核心文件（文件路径是 /src/app-support/app.js）
import RecordApp from 'recorder-core/src/app-support/app.js'

//所有平台必须引入的uni-app支持文件（如果编译出现路径错误，请把@换成 ../../ 这种）
import '@/uni_modules/Recorder-UniCore/app-uni-support.js'

/** 需要编译成微信小程序时，引入微信小程序支持文件 **/
// #ifdef MP-WEIXIN
import 'recorder-core/src/app-support/app-miniProgram-wx-support.js'
// #endif

/** H5、小程序环境中：引入需要的格式编码器、可视化插件，App环境中在renderjs中引入 **/
// 注意：如果App中需要在逻辑层中调用Recorder的编码/转码功能，需要去掉此条件编译，否则会报未加载编码器的错误
// #ifdef H5 || MP-WEIXIN
//按需引入你需要的录音格式支持文件，如果需要多个格式支持，把这些格式的编码引擎js文件统统引入进来即可
import 'recorder-core/src/engine/wav'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine' //如果此格式有额外的编码引擎（*-engine.js）的话，必须要加上

//可选的插件支持项，把需要的插件按需引入进来即可
import 'recorder-core/src/extensions/waveview'
// #endif

import { ref, onMounted, onUnmounted, computed } from 'vue'

// 录音状态
const recordAuth = ref(false) // 是否授权录音
const time = ref(0) // 录音时长
const duration = ref(60000) // 录音最大值ms 60000/1分钟
const isRecording = ref(false) // 是否正在录音
const timer = ref<number | null>(null) // 录音计时器

// 按钮背景图片
const buttonImage = computed(() => {
  return isRecording.value ? '/static/chat/stop.svg' : '/static/chat/voice.webp'
})

// 按钮背景大小
const buttonSize = computed(() => {
  return isRecording.value ? '80%' : '115%'
})

// 录音计时器
const recordingTimer = (_time: any) => {
  if (_time == undefined) {
    if (timer.value) clearInterval(timer.value)
    timer.value = setInterval(() => {
      time.value++
    }, 1000)
  } else {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }
}

// 请求录音权限
const authorRecord = (onSuccess?: () => void) => {
  RecordApp.UniWebViewActivate(getCurrentInstance()?.proxy)
  RecordApp.RequestPermission(
    () => {
      console.log('已获得录音权限，可以开始录音了')
      recordAuth.value = true
      onSuccess?.()
    },
    (msg, isUserNotAllow) => {
      if (isUserNotAllow) {
        uni.showModal({
          content: '检测到您没打开录音功能权限，是否去设置打开？',
          confirmText: '确认',
          confirmColor: '#1874f5',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (res) => {
                  const setting = res.authSetting
                  recordAuth.value = setting['scope.record'] || false
                  if (recordAuth.value) {
                    onSuccess?.()
                  }
                },
              })
            }
          },
        })
      }
      console.error('请求录音权限失败：' + msg)
    },
  )
}

// 开始录音
const startRecord = () => {
  if (!recordAuth.value) {
    authorRecord(() => {
      // 权限获取成功后直接开始录音
      startRecording()
    })
    return
  }
  startRecording()
}

// 实际开始录音的逻辑
const startRecording = () => {
  try {
    // 清除播放时间
    time.value = 0

    const set = {
      type: 'wav', // 使用 wav 格式，更通用且支持更好
      sampleRate: 16000, // 16kHz 采样率
      bitRate: 16, // 16bit 采样深度
      onProcess: (
        buffers: any,
        powerLevel: any,
        duration: any,
        sampleRate: any,
        newBufferIdx: any,
        asyncEnd: any,
      ) => {
        // 录音处理中
      },
    }

    // 验证录音格式
    if (!['wav', 'mp3', 'pcm', 'opus', 'webm'].includes(set.type)) {
      throw new Error(`不支持的录音格式: ${set.type}，仅支持 wav/mp3/pcm/opus/webm`)
    }

    RecordApp.UniWebViewActivate(getCurrentInstance()?.proxy)
    RecordApp.Start(
      set,
      () => {
        console.log('已开始录音')
        isRecording.value = true
        recordingTimer(undefined)
        emit('start-recording')
      },
      (msg) => {
        console.error('开始录音失败：' + msg)
        isRecording.value = false
        recordingTimer(time.value)
      },
    )
  } catch (error) {
    console.error('录音启动错误:', error)
    isRecording.value = false
    recordingTimer(time.value)
    // 显示错误提示
    uni.showToast({
      title: error instanceof Error ? error.message : '录音启动失败',
      icon: 'none',
      duration: 3000,
    })
  }
}

// 停止录音
const stopRecord = () => {
  if (!isRecording.value) return

  try {
    RecordApp.Stop(
      (arrayBuffer: any, duration: any, mime: any) => {
        recordingTimer(time.value)
        isRecording.value = false
        emit('stop-recording')

        // 获取文件扩展名
        const extension = mime.split('/')[1]
        if (!extension) {
          throw new Error('无法获取音频文件扩展名')
        }

        // 创建带扩展名的文件名
        const fileName = `recording.${extension}`

        // 创建 Blob 对象，确保设置正确的 MIME 类型
        const blob = new Blob([arrayBuffer], { type: mime })

        // 发送录音文件
        emit('audio-recorded', blob)

        // 更新录音时长
        time.value = Math.round(duration / 1000)
      },
      (msg) => {
        console.error('结束录音失败：' + msg)
        isRecording.value = false
        recordingTimer(time.value)
        uni.showToast({
          title: '录音结束失败',
          icon: 'none',
          duration: 3000,
        })
      },
    )
  } catch (error) {
    console.error('录音停止错误:', error)
    isRecording.value = false
    recordingTimer(time.value)
    uni.showToast({
      title: error instanceof Error ? error.message : '录音停止失败',
      icon: 'none',
      duration: 3000,
    })
  }
}

// 处理点击
const handleClick = () => {
  if (!isRecording.value) {
    startRecord()
  } else {
    stopRecord()
  }
}

// 初始化
const initVoice = () => {
  setDuration()
}

// 设置录音时长
const setDuration = async () => {
  const res: number = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(5 * 60 * 1000)
    }, 1000)
  })
  duration.value = res
}

// 定义事件
const emit = defineEmits<{
  (e: 'start-recording'): void
  (e: 'stop-recording'): void
  (e: 'audio-recorded', blob: Blob): void
}>()

// 组件挂载时初始化
onMounted(() => {
  initVoice()
  // 页面onShow时【必须调用】的函数，传入当前组件this
  RecordApp.UniPageOnShow(getCurrentInstance()?.proxy)
})

// 组件卸载时清理
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  if (isRecording.value) {
    try {
      RecordApp.Stop()
    } catch (error) {
      console.error('清理录音错误:', error)
    }
  }
})
</script>

<style lang="scss">
.voice-btn {
  width: 130rpx;
  height: 130rpx;
  padding: 0;
  background: none;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  overflow: visible;
  margin: -15rpx;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.9);
  }

  &::after {
    border: none;
  }
}

.card {
  margin: 0 0 24rpx;
  padding: 100rpx 24rpx;
  background: #ffffff;

  .title {
    margin-bottom: 16rpx;
    color: #333333;
    font-size: 28rpx;
    font-weight: 700;
  }

  .app-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .player {
    padding: 8rpx 16rpx 8rpx 8rpx;
    width: 354rpx;
    height: 64rpx;
    border-radius: 40rpx;
    background: #f8f8f8;

    .icon-play {
      width: 48rpx;
      height: 48rpx;
    }

    .icon-sound {
      width: 172rpx;
      height: 32rpx;
    }

    .time {
      color: #666666;
      font-size: 24rpx;
      font-weight: 400;
    }
  }
}

.prompt-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;

  .prompt-popup {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 220rpx;
    color: #000000;
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;

    &::after {
      content: '';
      position: absolute;
      left: -10%;
      bottom: -52%;
      border-radius: 50%;
      width: 120%;
      height: 185%;
      background: #cccccc;
      z-index: -1;
    }
  }
}
</style>
