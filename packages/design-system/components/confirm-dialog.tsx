import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type ConfirmDialogProps = {
  className?: string;
  confirmText?: string;
  destructive: boolean;
  disabled?: boolean;
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  subtitle: React.ReactNode;
  title: React.ReactNode;
  trigger?: React.ReactNode;
}

export const ConfirmDialog = ({ className, confirmText = "Confirm", destructive, disabled, onConfirm, onOpenChange, open, subtitle, title, trigger }: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      {trigger}
    </DialogTrigger>
    <DialogContent className={className}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {subtitle}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" asChild>
          <DialogClose>Cancel</DialogClose>
        </Button>

        <Button disabled={disabled} onClick={onConfirm}>{confirmText}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default ConfirmDialog