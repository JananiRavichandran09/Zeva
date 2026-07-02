import MuiCheckbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox'

export interface CheckboxProps extends MuiCheckboxProps {
  /** Optional text label rendered next to the checkbox. */
  label?: string
}

/**
 * Checkbox with an optional inline label.
 */
export function Checkbox({ label, ...props }: CheckboxProps) {
  if (!label) {
    return <MuiCheckbox {...props} />
  }

  return (
    <FormControlLabel control={<MuiCheckbox {...props} />} label={label} />
  )
}
