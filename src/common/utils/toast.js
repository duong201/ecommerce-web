// Import the message module directly (not `antd`'s root index) so bundlers/Jest
// don't have to pull in the entire antd component + icon set just for a toast.
import message from 'antd/lib/message'

message.config({ top: 72, duration: 3, maxCount: 3 })

/**
 * Single entry point for toast notifications across the app, so the underlying
 * library (currently antd's `message`) can be swapped without touching call sites.
 */
export const toast = {
  success: (content) => message.success(content),
  error: (content) => message.error(content),
  warning: (content) => message.warning(content),
  info: (content) => message.info(content),
}
