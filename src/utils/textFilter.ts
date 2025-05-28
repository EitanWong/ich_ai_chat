/**
 * 移除文本中的HTML标签
 * @param text 需要处理的文本
 * @returns 处理后的文本
 */
export function removeHtmlTags(text: string): string {
  if (!text) return '';
  
  // 移除HTML标签
  return text
    // 移除所有HTML标签，包括自定义标签如<最终回答>
    .replace(/<\/?[^>]+(>|$)/g, '')
    // 处理HTML实体
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .trim();
} 