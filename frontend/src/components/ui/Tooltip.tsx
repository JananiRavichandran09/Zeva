import MuiTooltip from '@mui/material/Tooltip'
import type { TooltipProps } from '@mui/material/Tooltip'

export type { TooltipProps }

/**
 * Hover/focus tooltip. Thin pass-through over MUI Tooltip so the rest of the
 * app imports from a single UI entry point.
 */
export function Tooltip(props: TooltipProps) {
  return <MuiTooltip arrow {...props} />
}
