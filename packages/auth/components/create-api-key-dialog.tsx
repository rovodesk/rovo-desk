import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { API_KEYS_QUERY_KEY } from "../hooks/use-apikey";
import { ApiKeyForm } from "./forms/api-key-form";

type CreateApiKeyDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

type Step = { type: "create" } | { type: "display"; key: string };

export function CreateApiKeyDialog({ open, setOpen }: CreateApiKeyDialogProps) {
	const [step, setStep] = useState<Step>({ type: "create" });
	const [copied, setCopied] = useState(false);
	const queryClient = useQueryClient();

	// Reset state when closing
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			// Use a small timeout so the user doesn't see the jump
			// from Step 2 back to Step 1 while the dialog is fading out
			setTimeout(() => {
				setStep({ type: "create" });
			}, 200);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: Value is coming from the API
	const handleCreateApiKeySuccess = useCallback((value: any) => {
		const apiKey = value?.key || value?.data?.key;

		if (!apiKey) {
			toast.error("Failed to retrieve API key from response");
			return;
		}
		setStep({
			type: "display",
			key: apiKey,
		});
	}, []);

	const handleCopy = async () => {
		if (step.type !== "display") return;

		setCopied(true);
		await navigator.clipboard.writeText(step.key);
		toast.success("API key copied");
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			{/* Added min-height to prevent layout jumping */}
			<DialogContent className="flex min-h-[300px] w-full max-w-lg flex-col gap-6 sm:max-w-2xl">
				{step.type === "create" && (
					<div className="fade-in animate-in space-y-4 duration-300">
						<DialogHeader>
							<DialogTitle>Create New API Key</DialogTitle>
							<DialogDescription>
								API keys grant access to your organization resources.
							</DialogDescription>
						</DialogHeader>

						<ApiKeyForm
							cancelable
							onCancel={() => handleOpenChange(false)}
							onSuccess={handleCreateApiKeySuccess}
						/>
					</div>
				)}
				{step.type === "display" && (
					<div className="fade-in zoom-in-95 animate-in space-y-6 duration-300">
						<DialogHeader>
							<DialogTitle>API Key Created</DialogTitle>
							<DialogDescription>
								Copy your API key now. You won't be able to see it again.
							</DialogDescription>
						</DialogHeader>

						<div className="flex items-center gap-2">
							<Input
								className="bg-muted font-mono text-sm"
								readOnly
								value={step.key}
							/>
							<Button onClick={handleCopy} size="icon" variant="outline">
								<CopyIcon
									className={cn(
										"transition-colors duration-200",
										copied ? "text-primary" : "text-muted-foreground"
									)}
								/>
							</Button>
						</div>

						<Button
							className="mt-4 w-full"
							onClick={() => {
								queryClient.invalidateQueries({
									queryKey: API_KEYS_QUERY_KEY,
								});
								handleOpenChange(false);
							}}
							variant="outline"
						>
							Done
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
