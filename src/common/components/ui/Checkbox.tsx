import React, { forwardRef, useId } from 'react'
import './Checkbox.scss'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  hint?: React.ReactNode
}

/**
 * A real checkbox input stays in the DOM - forms, labels and screen readers all
 * keep working - with the visual box drawn beside it.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, className, id, ...rest },
  ref,
) {
  const generatedId = useId()
  const boxId = id ?? generatedId

  return (
    <div className={['ui-check', className ?? ''].filter(Boolean).join(' ')}>
      <input ref={ref} id={boxId} type="checkbox" className="ui-check__input" {...rest} />
      <label className="ui-check__label" htmlFor={boxId}>
        <span className="ui-check__box" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path
              d="M3.5 8.5l3 3 6-6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="ui-check__text">
          {label}
          {hint && <span className="ui-check__hint">{hint}</span>}
        </span>
      </label>
    </div>
  )
})

export default Checkbox
