import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

export type InputProps = TextFieldProps

/**
 * Single-line text input. Wraps MUI TextField with app defaults
 * (full width, small size, outlined).
 */
export function Input(props: InputProps) {
  return <TextField fullWidth size="small" variant="outlined" {...props} />
}
