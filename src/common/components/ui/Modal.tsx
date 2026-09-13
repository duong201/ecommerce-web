import { useTranslation } from 'react-i18next'
import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.scss'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  /** Buttons pinned to the bottom of the dialog. */
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Set false for destructive flows that must be dismissed with a button. */
  dismissOnBackdrop?: boolean
  children?: React.ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible dialog: rendered in a portal, closes on Escape and backdrop click,
 * locks page scroll, keeps Tab inside itself and hands focus back to whatever
 * opened it. This is what replaced the browser's window.confirm/prompt boxes.
 */
const Modal = ({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  dismissOnBackdrop = true,
  children,
}: ModalProps) => {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusTo = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return undefined

    restoreFocusTo.current = document.activeElement as HTMLElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown, true)

    // Land focus on the first control rather than on the dialog shell.
    const timer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      ;(target ?? panelRef.current)?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.body.style.overflow = overflow
      restoreFocusTo.current?.focus?.()
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div
      className="ui-modal"
      onMouseDown={(event) => {
        if (dismissOnBackdrop && event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={`ui-modal__panel ui-modal__panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
      >
        {title && (
          <div className="ui-modal__header">
            <div>
              <h2 className="ui-modal__title">{title}</h2>
              {description && <p className="ui-modal__description">{description}</p>}
            </div>
            <button
              type="button"
              className="ui-modal__close"
              onClick={onClose}
              aria-label={t('ui.closeDialog')}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {children && <div className="ui-modal__body">{children}</div>}
        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
