/**
 * 动态加载 CSS 文件
 * @param url - CSS 文件的 URL
 */
export function loadCSS(url: string) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}

/**
 * 动态加载 JS 文件
 * @param url - JS 文件的 URL
 */
export function loadJS(url: string) {
  const script = document.createElement('script')
  script.src = url
  script.async = true
  document.head.appendChild(script)
}
