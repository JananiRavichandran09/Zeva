import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

export interface TextareaProps extends Omit<TextFieldProps, 'multiline'> {
  /** Minimum visible rows. Defaults to 3. */
  minRows?: number
  /** Maximum rows before scrolling. Defaults to 8. */
  maxRows?: number
}

/**
 * Multi-line text input that auto-grows between minRows and maxRows.
 */
export function Textarea({ minRows = 3, maxRows = 8, ...props }: TextareaProps) {
  return (
    <TextField
      fullWidth
      multiline
      minRows={minRows}
      maxRows={maxRows}
      variant="outlined"
      {...props}
    />
  )
}
