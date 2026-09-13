import React from 'react'
import './Avatar.scss'

interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/** Initials on a brand-tinted disc, with an image when one is available. */
const initials = (name?: string | null): string => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const Avatar = ({ name, src, size = 'md', className }: AvatarProps) => (
  <span
    className={['ui-avatar', `ui-avatar--${size}`, className ?? ''].filter(Boolean).join(' ')}
    title={name ?? undefined}
  >
    {src ? <img src={src} alt={name ?? ''} loading="lazy" /> : <span>{initials(name)}</span>}
  </span>
)

export default Avatar
