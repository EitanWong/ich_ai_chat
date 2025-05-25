// 音频转写服务配置
export const AUDIO_CONFIG = {
  // API 配置
  API_URL: 'https://api.siliconflow.cn/v1/audio/transcriptions',
  MODEL: 'FunAudioLLM/SenseVoiceSmall',

  // 录音配置
  MAX_RECORDING_DURATION: 60000, // 最大录音时长（毫秒）
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 最大文件大小（10MB）

  // 支持的音频格式
  SUPPORTED_FORMATS: ['wav', 'mp3', 'pcm', 'opus', 'webm'],

  // MIME 类型到文件扩展名的映射
  MIME_TO_EXTENSION: {
    'audio/wav': 'wav',
    'audio/mp3': 'mp3',
    'audio/mpeg': 'mp3',
    'audio/pcm': 'pcm',
    'audio/opus': 'opus',
    'audio/webm': 'webm',
  },

  // 重试配置
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 重试延迟（毫秒）

  // 错误消息
  ERROR_MESSAGES: {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    AUTH_ERROR: '认证失败，请检查 API Token',
    SERVER_ERROR: '服务器错误，请稍后重试',
    FORMAT_ERROR: '不支持的音频格式，仅支持 wav/mp3/pcm/opus/webm 格式',
    SIZE_ERROR: '音频文件过大',
    DURATION_ERROR: '录音时长过长',
    UNKNOWN_ERROR: '未知错误，请稍后重试',
  },
}
