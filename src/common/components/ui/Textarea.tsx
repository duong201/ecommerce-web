import React, { forwardRef, useId } from 'react'
import Field, { FieldProps } from './Field'
import './Textarea.scss'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  Omit<FieldProps, 'children' | 'htmlFor'>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, className, id, rows = 3, ...rest },
  ref,
) {
  const generatedId = useId()
  const areaId = id ?? generatedId

  return (
    <Field
      label={label}
      htmlFor={areaId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className="ui-textarea"
        required={required}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
    </Field>
  )
})

export default Textarea
