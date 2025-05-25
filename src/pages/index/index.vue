<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '温州非遗AI问答',
  },
}
</route>
<template>
  <view class="page">
    <!-- <view class="page__header">
      <text class="page__title">温州非遗AI问答</text>
    </view> -->
    <ChatContainer />
  </view>
</template>

<script lang="ts" setup>
import ChatContainer from '@/components/chat/ChatContainer.vue'
import PLATFORM from '@/utils/platform'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 测试 uni API 自动引入
onLoad(() => {})
</script>

<style lang="scss">
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;

  // &__header {
  //   height: 88rpx;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   background-color: #fff;
  //   border-bottom: 1rpx solid #eee;
  //   position: relative;
  //   z-index: 1;
  // }

  &__title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.main-title-color {
  color: #d14328;
}
</style>
