// Import the message module directly (not `antd`'s root index) so bundlers/Jest
// don't have to pull in the entire antd component + icon set just for a toast.
import message from 'antd/lib/message'
import type { ReactNode } from 'react'

message.config({ top: 72, duration: 3, maxCount: 3 })

/**
 * Single entry point for toast notifications across the app, so the underlying
 * library (currently antd's `message`) can be swapped without touching call sites.
 */
export const toast = {
  success: (content: ReactNode) => message.success(content),
  error: (content: ReactNode) => message.error(content),
  warning: (content: ReactNode) => message.warning(content),
  info: (content: ReactNode) => message.info(content),
}
