import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import './Button.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>

/**
 * The one button in the app. Anchors and router links get the same look through
 * `LinkButton` below so a "Continue shopping" link never drifts from a real
 * submit button.
 */
export const buttonClass = ({
  variant = 'primary',
  size = 'md',
  block,
  loading,
  className,
}: CommonProps): string =>
  [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    block ? 'ui-btn--block' : '',
    loading ? 'is-loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

const Content = ({ iconLeft, iconRight, children }: CommonProps) => (
  <>
    {iconLeft && <span className="ui-btn__icon">{iconLeft}</span>}
    {children != null && children !== false && <span className="ui-btn__label">{children}</span>}
    {iconRight && <span className="ui-btn__icon">{iconRight}</span>}
  </>
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, loading, iconLeft, iconRight, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={buttonClass({ variant, size, block, loading, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="ui-btn__spinner" aria-hidden="true" />}
      <Content iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </Content>
    </button>
  )
})

type LinkButtonProps = CommonProps & { to: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | 'href'
  >

export const LinkButton = ({
  to,
  variant,
  size,
  block,
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: LinkButtonProps) => (
  <Link to={to} className={buttonClass({ variant, size, block, className })} {...rest}>
    <Content iconLeft={iconLeft} iconRight={iconRight}>
      {children}
    </Content>
  </Link>
)

export default Button
