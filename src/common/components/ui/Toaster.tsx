import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { dismissToast, subscribeToasts, ToastRecord } from '../../utils/toast'
import './Toaster.scss'

const ICONS: Record<ToastRecord['tone'], string> = {
  success: 'M4 8.5l2.8 2.8L12 5.5',
  error: 'M5.5 5.5l5 5M10.5 5.5l-5 5',
  warning: 'M8 4.5v4.2M8 11.4v.1',
  info: 'M8 7.2v4.4M8 4.5v.1',
}

/**
 * Renders the toast queue held in `utils/toast`. Mounted once at the app root;
 * everything else just calls `toast.success(...)`.
 */
const Toaster = () => {
  const { t } = useTranslation()
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  useEffect(() => subscribeToasts(setToasts), [])

  if (toasts.length === 0) return null

  return createPortal(
    <div className="ui-toaster" role="region" aria-label={t('ui.notifications')}>
      {toasts.map((entry) => (
        <div
          key={entry.id}
          className={`ui-toast ui-toast--${entry.tone}`}
          role={entry.tone === 'error' ? 'alert' : 'status'}
        >
          <span className="ui-toast__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path
                d={ICONS[entry.tone]}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="ui-toast__content">{entry.content}</div>

          <button
            type="button"
            className="ui-toast__close"
            onClick={() => dismissToast(entry.id)}
            aria-label={t('ui.dismiss')}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4.5 4.5l7 7M11.5 4.5l-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    document.body,
  )
}

export default Toaster
