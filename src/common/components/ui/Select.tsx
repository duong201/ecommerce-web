import React, { forwardRef, useId } from 'react'
import Field, { FieldProps } from './Field'
import './Select.scss'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  disabled?: boolean
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
  Omit<FieldProps, 'children' | 'htmlFor'> & {
    options: SelectOption[]
    placeholder?: string
    size?: 'sm' | 'md'
  }

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, required, className, options, placeholder, size = 'md', id, ...rest },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <Field
      label={label}
      htmlFor={selectId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div className={`ui-select ui-select--${size}`}>
        <select
          ref={ref}
          id={selectId}
          className="ui-select__control"
          required={required}
          aria-invalid={error ? true : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="ui-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Field>
  )
})

export default Select
