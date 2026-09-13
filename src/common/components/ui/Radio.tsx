import React from 'react'
import './Radio.scss'

export interface RadioOption<T extends string = string> {
  value: T
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

interface RadioGroupProps<T extends string> {
  name: string
  value: T
  options: RadioOption<T>[]
  onChange: (value: T) => void
  legend?: React.ReactNode
  /** `card` draws each option as a selectable tile; `inline` is a plain row. */
  layout?: 'card' | 'inline'
  className?: string
}

/**
 * Radio group rendered as selectable cards - the pattern used for payment
 * methods, where each option needs room for a description.
 */
const RadioGroup = <T extends string>({
  name,
  value,
  options,
  onChange,
  legend,
  layout = 'card',
  className,
}: RadioGroupProps<T>) => (
  <fieldset
    className={['ui-radio-group', `ui-radio-group--${layout}`, className ?? '']
      .filter(Boolean)
      .join(' ')}
  >
    {legend && <legend className="ui-radio-group__legend">{legend}</legend>}

    <div className="ui-radio-group__options">
      {options.map((option) => (
        <label
          key={option.value}
          className={['ui-radio', value === option.value ? 'is-selected' : '']
            .filter(Boolean)
            .join(' ')}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          <span className="ui-radio__marker" aria-hidden="true" />
          <span className="ui-radio__body">
            <span className="ui-radio__label">
              {option.icon && <span className="ui-radio__icon">{option.icon}</span>}
              {option.label}
            </span>
            {option.description && (
              <span className="ui-radio__description">{option.description}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
)

export default RadioGroup
