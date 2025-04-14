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

export function bindEvent<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  element: T,
  name: K,
  callback: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  element.addEventListener(name, callback as EventListener, options)
}

export function unbindEvent<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  element: T,
  name: K,
  callback: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  element.removeEventListener(name, callback as EventListener, options)
}

export function createCustomEvent(eventName: string, element: HTMLElement, detail: any) {
  const event = new CustomEvent(eventName, {
    detail,
  })
  element.dispatchEvent(event)
}
