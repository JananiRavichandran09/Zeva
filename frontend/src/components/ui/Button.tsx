import MuiButton from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<MuiButtonProps, 'variant' | 'color' | 'size'> {
  /** Visual style of the button. Defaults to "primary". */
  variant?: ButtonVariant
  /** Button size. Defaults to "md". */
  size?: ButtonSize
  /** When true, shows a spinner and disables the button. */
  loading?: boolean
}

const variantMap: Record<
  ButtonVariant,
  Pick<MuiButtonProps, 'variant' | 'color'>
> = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'contained', color: 'secondary' },
  outline: { variant: 'outlined', color: 'primary' },
  ghost: { variant: 'text', color: 'primary' },
  danger: { variant: 'contained', color: 'error' },
}

const sizeMap: Record<ButtonSize, MuiButtonProps['size']> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
}

/**
 * Primary action button. Wraps MUI Button with the app's variants,
 * sizing, and a built-in loading state.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  startIcon,
  children,
  ...props
}: ButtonProps) {
  const { variant: muiVariant, color } = variantMap[variant]

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={sizeMap[size]}
      disableElevation
      disabled={disabled || loading}
      startIcon={
        loading ? <CircularProgress size={16} color="inherit" /> : startIcon
      }
      {...props}
    >
      {children}
    </MuiButton>
  )
}
