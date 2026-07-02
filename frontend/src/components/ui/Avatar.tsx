import MuiAvatar from '@mui/material/Avatar'
import type { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar'

export interface AvatarProps extends MuiAvatarProps {
  /** Full name, used for the alt text and initials fallback. */
  name?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * User avatar. Falls back to initials derived from `name` when no image is set.
 */
export function Avatar({ name, src, children, ...props }: AvatarProps) {
  return (
    <MuiAvatar src={src} alt={name} {...props}>
      {children ?? (name ? getInitials(name) : null)}
    </MuiAvatar>
  )
}
