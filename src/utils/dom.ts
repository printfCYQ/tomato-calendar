export function createElement(tagName: string, className?: string, textContent?: string): HTMLElement {
  const element = document.createElement(tagName)
  if (className) {
    element.className = className
  }
  if (textContent) {
    element.textContent = textContent
  }
  return element
}
