import { useQuery } from "@tanstack/react-query";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Copy, Eye, EyeOff, Info, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useChatbot } from "@/hooks/use-chatbot";

type Props = {
	connectionId: string;
	connectionType: "CLIENT" | "SERVER" | undefined;
};

export function KeyManager({ connectionId, connectionType }: Props) {
	const [showKey, setShowKey] = useState(false);
	const [newKey, setNewKey] = useState<string | null>(null);
	const [isRotating, setIsRotating] = useState(false);

	const { rotateConnectionKeysAsync, getConnectionQueryOptions } = useChatbot();

	const { data: connection } = useQuery(
		getConnectionQueryOptions(connectionId)
	);
	const currentKey =
		connectionType === "SERVER"
			? connection?.keys?.privateKey
			: connection?.keys?.publicKey;
	if (!currentKey) {
		return null;
	}

	const keyLabel =
		connectionType === "SERVER"
			? "Private Access Token"
			: "Public Access Token";

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	};

	const handleRotate = async () => {
		if (!connectionType) return;
		// TODO: Add confirm Modal
		try {
			setIsRotating(true);
			setShowKey(false);

			const result = await rotateConnectionKeysAsync({
				connectionId,
				connectionType,
			});

			const rotatedKey = result?.publicKey ?? result?.privateKey ?? null;

			if (rotatedKey) {
				setNewKey(rotatedKey);
			}

			toast.success("Key rotated successfully");
		} catch {
			toast.error("Failed to rotate key");
		} finally {
			setIsRotating(false);
		}
	};

	return (
		<section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-semibold text-lg">API Credentials</h2>
					<p className="text-muted-foreground text-sm">
						Use this key to authenticate your requests.
					</p>
				</div>

				<Button
					className="text-amber-500 hover:text-amber-600"
					disabled={!!newKey || isRotating}
					onClick={handleRotate}
					size="sm"
					variant="outline"
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Rotate Key
				</Button>
			</div>

			{/* ONE-TIME REVEAL MODE */}
			{newKey ? (
				<div className="space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-semibold text-amber-600">
								New Key Generated
							</h3>
							<p className="text-muted-foreground text-sm">
								This key will not be shown again. Copy and store it securely.
							</p>
						</div>
						<Badge variant="secondary">One-Time View</Badge>
					</div>

					<div className="relative rounded-xl border bg-background p-4">
						<code className="block break-all font-mono text-amber-500 text-sm">
							{newKey}
						</code>

						<Button
							className="absolute top-3 right-3"
							onClick={() => handleCopy(newKey)}
							size="icon"
							variant="secondary"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex justify-end">
						<Button onClick={() => setNewKey(null)}>I've Saved This Key</Button>
					</div>
				</div>
			) : (
				/* NORMAL MODE */
				<div className="space-y-3 rounded-xl border border-dashed bg-muted/50 p-4">
					<Label className="block font-bold text-muted-foreground text-xs uppercase tracking-wider">
						{keyLabel}
					</Label>

					<div className="flex items-center gap-2">
						<div className="relative flex-1">
							<Input
								className="pr-10 font-mono"
								readOnly
								type={showKey ? "text" : "password"}
								value={currentKey}
							/>

							<button
								className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary"
								onClick={() => setShowKey((prev) => !prev)}
								type="button"
							>
								{showKey ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>

						<Button
							onClick={() => handleCopy(currentKey)}
							size="icon"
							variant="secondary"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex items-start gap-2 text-muted-foreground text-xs">
						<Info className="mt-0.5 h-3 w-3" />
						<p>
							Rotating your key will immediately invalidate the current one. Use
							with caution.
						</p>
					</div>
				</div>
			)}
		</section>
	);
}
