import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import type { TextFieldProps } from '@mui/material/TextField'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps
  extends Omit<TextFieldProps, 'select' | 'children'> {
  /** The options to render in the dropdown. */
  options: SelectOption[]
  /** Optional placeholder shown as a disabled first item. */
  placeholder?: string
}

/**
 * Dropdown select driven by a typed options array.
 */
export function Select({ options, placeholder, ...props }: SelectProps) {
  return (
    <TextField select fullWidth size="small" variant="outlined" {...props}>
      {placeholder && (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
