import MuiSwitch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { SwitchProps as MuiSwitchProps } from '@mui/material/Switch'

export interface SwitchProps extends MuiSwitchProps {
  /** Optional text label rendered next to the toggle. */
  label?: string
}

/**
 * Toggle switch with an optional inline label.
 */
export function Switch({ label, ...props }: SwitchProps) {
  if (!label) {
    return <MuiSwitch {...props} />
  }

  return <FormControlLabel control={<MuiSwitch {...props} />} label={label} />
}
