import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import './DialogProvider.scss'

interface ConfirmOptions {
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Paints the confirm button red and keeps backdrop-dismiss on. */
  tone?: 'default' | 'danger'
}

interface PromptOptions extends ConfirmOptions {
  label?: string
  placeholder?: string
  defaultValue?: string
  /** `number` validates and hands back a numeric string. */
  inputType?: 'text' | 'number' | 'multiline'
  required?: boolean
  hint?: React.ReactNode
  /** Return a message to block submission, or null/undefined to accept. */
  validate?: (value: string) => string | null | undefined
}

interface InfoOptions {
  title: string
  description?: React.ReactNode
  confirmLabel?: string
}

interface DialogApi {
  /** Resolves true when confirmed, false when dismissed. */
  confirm: (options: ConfirmOptions) => Promise<boolean>
  /** Resolves the entered string, or null when dismissed. */
  prompt: (options: PromptOptions) => Promise<string | null>
  /** Message with a single dismiss button; resolves once it is closed. */
  info: (options: InfoOptions) => Promise<void>
}

type DialogState =
  | { kind: 'none' }
  | { kind: 'confirm'; options: ConfirmOptions }
  | { kind: 'prompt'; options: PromptOptions }
  | { kind: 'info'; options: InfoOptions }

const DialogContext = createContext<DialogApi | null>(null)

/**
 * In-app replacements for window.confirm and window.prompt. Both return a
 * promise, so a call site reads almost exactly as it did before:
 *
 *   if (!(await confirm({ title: 'Delete?' }))) return
 *
 * The browser dialogs were the single biggest visual break in the old admin -
 * an OS chrome box in the middle of a designed page, unstyleable and
 * untranslatable.
 */
export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const [state, setState] = useState<DialogState>({ kind: 'none' })
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const resolver = useRef<((result: never) => void) | null>(null)

  const settle = useCallback((result: boolean | string | null | undefined) => {
    const resolve = resolver.current
    resolver.current = null
    setState({ kind: 'none' })
    setError(null)
    resolve?.(result as never)
  }, [])

  const api = useMemo<DialogApi>(
    () => ({
      confirm: (options) =>
        new Promise<boolean>((resolve) => {
          resolver.current = resolve as (result: never) => void
          setState({ kind: 'confirm', options })
        }),
      prompt: (options) =>
        new Promise<string | null>((resolve) => {
          resolver.current = resolve as (result: never) => void
          setValue(options.defaultValue ?? '')
          setState({ kind: 'prompt', options })
        }),
      info: (options) =>
        new Promise<void>((resolve) => {
          resolver.current = resolve as (result: never) => void
          setState({ kind: 'info', options })
        }),
    }),
    [],
  )

  const options = state.kind === 'none' ? null : state.options
  const isPrompt = state.kind === 'prompt'
  const isInfo = state.kind === 'info'
  const dismiss = () => settle(isPrompt ? null : isInfo ? undefined : false)
  const promptOptions = isPrompt ? (state.options as PromptOptions) : null

  const submitPrompt = (event: React.FormEvent) => {
    event.preventDefault()
    if (!promptOptions) return

    const trimmed = value.trim()
    if (promptOptions.required && !trimmed) {
      setError(t('ui.fieldRequired'))
      return
    }
    if (promptOptions.inputType === 'number' && trimmed && Number.isNaN(Number(trimmed))) {
      setError(t('ui.enterNumber'))
      return
    }

    const message = promptOptions.validate?.(trimmed)
    if (message) {
      setError(message)
      return
    }

    settle(trimmed)
  }

  return (
    <DialogContext.Provider value={api}>
      {children}

      <Modal
        open={state.kind !== 'none'}
        onClose={dismiss}
        title={options?.title}
        description={options?.description}
        size="sm"
        footer={
          <>
            {!isInfo && (
              <Button variant="ghost" onClick={dismiss}>
                {(options as ConfirmOptions | undefined)?.cancelLabel ?? t('common.cancel')}
              </Button>
            )}
            <Button
              variant={
                !isInfo && (options as ConfirmOptions | undefined)?.tone === 'danger'
                  ? 'danger'
                  : 'primary'
              }
              form={isPrompt ? 'ui-prompt-form' : undefined}
              type={isPrompt ? 'submit' : 'button'}
              onClick={isPrompt ? undefined : () => settle(isInfo ? undefined : true)}
            >
              {options?.confirmLabel ?? (isInfo ? t('common.gotIt') : t('common.confirm'))}
            </Button>
          </>
        }
      >
        {promptOptions && (
          <form id="ui-prompt-form" className="ui-prompt" onSubmit={submitPrompt}>
            {promptOptions.inputType === 'multiline' ? (
              <Textarea
                label={promptOptions.label}
                hint={promptOptions.hint}
                error={error}
                placeholder={promptOptions.placeholder}
                value={value}
                autoFocus
                onChange={(event) => {
                  setValue(event.target.value)
                  setError(null)
                }}
              />
            ) : (
              <Input
                label={promptOptions.label}
                hint={promptOptions.hint}
                error={error}
                type={promptOptions.inputType === 'number' ? 'number' : 'text'}
                step={promptOptions.inputType === 'number' ? 'any' : undefined}
                placeholder={promptOptions.placeholder}
                value={value}
                autoFocus
                onChange={(event) => {
                  setValue(event.target.value)
                  setError(null)
                }}
              />
            )}
          </form>
        )}
      </Modal>
    </DialogContext.Provider>
  )
}

export const useDialog = (): DialogApi => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used inside <DialogProvider>')
  }
  return context
}

export default DialogProvider
