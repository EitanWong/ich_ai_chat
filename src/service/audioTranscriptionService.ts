import { AUDIO_CONFIG } from '@/config/audio'

// 获取文件扩展名
const getFileExtension = (mimeType: string): string | null => {
  return AUDIO_CONFIG.MIME_TO_EXTENSION[mimeType] || null
}

// 验证音频文件
const validateAudioFile = (audioBlob: Blob): string | null => {
  // 检查文件大小
  if (audioBlob.size > AUDIO_CONFIG.MAX_FILE_SIZE) {
    return AUDIO_CONFIG.ERROR_MESSAGES.SIZE_ERROR
  }

  // 检查音频格式
  const extension = getFileExtension(audioBlob.type)
  if (!extension || !AUDIO_CONFIG.SUPPORTED_FORMATS.includes(extension)) {
    return AUDIO_CONFIG.ERROR_MESSAGES.FORMAT_ERROR
  }

  return null
}

// 延迟函数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 重试函数
const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = AUDIO_CONFIG.MAX_RETRIES,
  delay: number = AUDIO_CONFIG.RETRY_DELAY,
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    await new Promise((resolve) => setTimeout(resolve, delay))
    return retry(fn, retries - 1, delay)
  }
}

export const transcribeAudio = async (audioBlob: Blob, token: string): Promise<string | null> => {
  // 验证音频文件
  const validationError = validateAudioFile(audioBlob)
  if (validationError) {
    console.error('音频文件验证失败:', validationError)
    throw new Error(validationError)
  }

  // 创建 FormData
  const form = new FormData()

  // 获取文件扩展名
  const extension = getFileExtension(audioBlob.type)
  if (!extension) {
    throw new Error(AUDIO_CONFIG.ERROR_MESSAGES.FORMAT_ERROR)
  }

  // 创建带扩展名的文件
  const file = new File([audioBlob], `recording.${extension}`, { type: audioBlob.type })
  form.append('file', file)
  form.append('model', AUDIO_CONFIG.MODEL)

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  }

  try {
    const response = await retry(async () => {
      const res = await fetch(AUDIO_CONFIG.API_URL, options)
      if (!res.ok) {
        const errorText = await res.text()
        console.error('语音转写 API 请求失败:', res.status, errorText)

        // 根据状态码返回具体错误信息
        if (res.status === 401) {
          throw new Error(AUDIO_CONFIG.ERROR_MESSAGES.AUTH_ERROR)
        } else if (res.status >= 500) {
          throw new Error(AUDIO_CONFIG.ERROR_MESSAGES.SERVER_ERROR)
        } else {
          // 尝试解析错误信息
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.message || AUDIO_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR)
          } catch {
            throw new Error(errorText || AUDIO_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR)
          }
        }
      }
      return res
    })

    const data = await response.json()
    console.log('语音转写结果:', data)
    return data.text
  } catch (err) {
    console.error('语音转写 API 调用错误:', err)
    throw err
  }
}
