import React, { forwardRef, useId } from 'react'
import Field, { FieldProps } from './Field'
import './Input.scss'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Omit<FieldProps, 'children' | 'htmlFor'> & {
    /** Icon glued to the left inside the control. Named to sidestep the native `prefix` attribute. */
    iconLeft?: React.ReactNode
    /** Icon or unit glued to the right inside the control. */
    iconRight?: React.ReactNode
    size?: 'sm' | 'md'
  }

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, className, iconLeft, iconRight, size = 'md', id, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <Field
      label={label}
      htmlFor={inputId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={[
          'ui-input',
          `ui-input--${size}`,
          iconLeft ? 'has-prefix' : '',
          iconRight ? 'has-suffix' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {iconLeft && <span className="ui-input__affix ui-input__affix--start">{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          className="ui-input__control"
          required={required}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {iconRight && <span className="ui-input__affix ui-input__affix--end">{iconRight}</span>}
      </div>
    </Field>
  )
})

export default Input
