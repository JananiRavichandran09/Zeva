import CircularProgress from '@mui/material/CircularProgress'
import type { CircularProgressProps } from '@mui/material/CircularProgress'

export interface SpinnerProps extends CircularProgressProps {
  /** Optional text shown beneath the spinner, centered. */
  label?: string
}

/**
 * Loading spinner, optionally centered with a label below it.
 */
export function Spinner({ label, size = 28, ...props }: SpinnerProps) {
  if (!label) {
    return <CircularProgress size={size} {...props} />
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <CircularProgress size={size} {...props} />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  )
}
