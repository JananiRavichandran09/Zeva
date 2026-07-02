import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from './IconButton'
import type { ReactNode } from 'react'

export interface ModalProps {
  /** Whether the modal is visible. */
  open: boolean
  /** Called when the user requests to close (backdrop, escape, or close button). */
  onClose: () => void
  /** Heading shown at the top of the modal. */
  title?: string
  /** Body content. */
  children: ReactNode
  /** Optional footer actions (e.g. Cancel / Confirm buttons). */
  footer?: ReactNode
  /** Max width of the dialog. Defaults to "sm". */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg'
}

/**
 * Centered modal dialog with an optional title, close button, and footer.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'sm',
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {title && (
        <DialogTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{title}</span>
          <IconButton label="Close" size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  )
}
