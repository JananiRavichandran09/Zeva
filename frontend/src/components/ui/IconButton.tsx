import MuiIconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton'

export interface IconButtonProps extends MuiIconButtonProps {
  /** Accessible label, also shown as a tooltip on hover. Required for a11y. */
  label: string
}

/**
 * Square icon-only button. Always carries an accessible label and a tooltip.
 */
export function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <Tooltip title={label}>
      <span>
        <MuiIconButton aria-label={label} {...props}>
          {children}
        </MuiIconButton>
      </span>
    </Tooltip>
  )
}
