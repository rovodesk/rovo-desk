"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { useModalContext } from "../context/modal";

export const ModalHost = () => {
	const { modals, close } = useModalContext();

	return (
		<>
			{Object.entries(modals).map(([key, modal]) => (
				<Dialog
					key={key}
					onOpenChange={(open) => {
						if (!open) close(key);
					}}
					open={modal.open}
				>
					<DialogHeader>
						<DialogTitle>{modal.title}</DialogTitle>
						<DialogDescription>{modal.description}</DialogDescription>
					</DialogHeader>
					<DialogContent
						className={modal.options?.modalBoxClassName}
						onInteractOutside={(e) => {
							if (!modal.options?.shouldAllowBackdropClick) {
								e.preventDefault();
							}
						}}
					>
						<modal.component />
					</DialogContent>
				</Dialog>
			))}
		</>
	);
};