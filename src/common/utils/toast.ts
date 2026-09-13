import type { ReactNode } from 'react'

export type ToastTone = 'success' | 'error' | 'warning' | 'info'

export interface ToastRecord {
  id: number
  tone: ToastTone
  content: ReactNode
  duration: number
}

type Listener = (toasts: ToastRecord[]) => void

const DEFAULT_DURATION = 3500
const MAX_VISIBLE = 3

let toasts: ToastRecord[] = []
let nextId = 1
const listeners = new Set<Listener>()

const emit = () => {
  listeners.forEach((listener) => listener(toasts))
}

export const dismissToast = (id: number): void => {
  toasts = toasts.filter((entry) => entry.id !== id)
  emit()
}

const push = (tone: ToastTone, content: ReactNode, duration = DEFAULT_DURATION): number => {
  const id = nextId
  nextId += 1

  // Oldest first out, so a burst of errors never buries the screen.
  toasts = [...toasts, { id, tone, content, duration }].slice(-MAX_VISIBLE)
  emit()

  if (duration > 0) {
    window.setTimeout(() => dismissToast(id), duration)
  }
  return id
}

/** Subscribe to the toast queue. Returns the unsubscribe function. */
export const subscribeToasts = (listener: Listener): (() => void) => {
  listeners.add(listener)
  listener(toasts)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Imperative toast API, deliberately identical to the shape the app already
 * used so call sites did not change when antd's `message` was dropped in
 * favour of a toaster that follows the app's own design tokens.
 */
export const toast = {
  success: (content: ReactNode, duration?: number) => push('success', content, duration),
  error: (content: ReactNode, duration?: number) => push('error', content, duration),
  warning: (content: ReactNode, duration?: number) => push('warning', content, duration),
  info: (content: ReactNode, duration?: number) => push('info', content, duration),
  dismiss: dismissToast,
}
