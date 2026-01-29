import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/alert-dialog";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
	onOpenChange: (open: boolean) => void;
	title: React.ReactNode;
	disabled?: boolean;
	desc: React.JSX.Element | string;
	cancelBtnText?: string;
	confirmText?: React.ReactNode;
	destructive?: boolean;
	handleConfirm: () => void;
	open?: boolean;
	isLoading?: boolean;
	className?: string;
	children?: React.ReactNode;
	trigger?: React.ReactNode;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
	const {
		title,
		desc,
		children,
		className,
		confirmText,
		cancelBtnText,
		destructive,
		isLoading,
		disabled = false,
		open,
		handleConfirm,
		trigger,
		...actions
	} = props;
	return (
		<AlertDialog open={open} {...actions}>
			{trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
			<AlertDialogContent className={cn(className && className)}>
				<AlertDialogHeader className="text-start">
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div>{desc}</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				{children}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						{cancelBtnText ?? "Cancel"}
					</AlertDialogCancel>
					<Button
						disabled={disabled || isLoading}
						onClick={handleConfirm}
						variant={destructive ? "destructive" : "default"}
					>
						{isLoading ? (
							<span className="inline-flex items-center gap-2">
								<Loader2 className="animate-spin" />
								Processing…
							</span>
						) : (
							(confirmText ?? "Continue")
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
