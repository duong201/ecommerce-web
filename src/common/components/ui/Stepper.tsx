import React from 'react'
import { useTranslation } from 'react-i18next'
import './Stepper.scss'

interface StepperProps {
  value: React.ReactNode
  onDecrease: () => void
  onIncrease: () => void
  decreaseDisabled?: boolean
  increaseDisabled?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

/**
 * Quantity control for the cart and the product page. The value is rendered,
 * not typed into, because fruit sold by weight steps in 0.1kg increments the
 * server dictates - free-text entry would let the customer request a quantity
 * the picker cannot fulfil.
 */
const Stepper = ({
  value,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
  disabled,
  size = 'md',
  label,
  className,
}: StepperProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={['ui-stepper', `ui-stepper--${size}`, className ?? ''].filter(Boolean).join(' ')}
      role="group"
      aria-label={label ?? t('common.quantity')}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || decreaseDisabled}
        aria-label={t('ui.decreaseQuantity')}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M3.5 8h9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <span className="ui-stepper__value numeric">{value}</span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled || increaseDisabled}
        aria-label={t('ui.increaseQuantity')}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 3.5v9M3.5 8h9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default Stepper
