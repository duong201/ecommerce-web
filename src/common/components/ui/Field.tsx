import React from 'react'
import './Field.scss'

export interface FieldProps {
  /** Rendered as the <label> text; omit for a bare control. */
  label?: React.ReactNode
  htmlFor?: string
  hint?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Label / control / hint / error scaffolding shared by every form control, so
 * an error message looks the same on the checkout form and in an admin dialog.
 */
const Field = ({ label, htmlFor, hint, error, required, className, children }: FieldProps) => (
  <div
    className={['ui-field', error ? 'is-invalid' : '', className ?? ''].filter(Boolean).join(' ')}
  >
    {label && (
      <label className="ui-field__label" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="ui-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
    )}

    {children}

    {error ? (
      <p className="ui-field__error" role="alert">
        {error}
      </p>
    ) : (
      hint && <p className="ui-field__hint">{hint}</p>
    )}
  </div>
)

export default Field
