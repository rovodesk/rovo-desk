import { useCMS } from "@zero-heads-lab/cms/provider";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export const SyncIndicator = () => {
	const { syncStatus } = useCMS();

	return (
		<div className="flex items-center gap-2 text-[12px]">
			{syncStatus === "synced" && (
				<span className="flex items-center gap-1.5 text-success">
					<CheckCircle2 className="h-3.5 w-3.5" /> Changes synced
				</span>
			)}
			{syncStatus === "saving" && (
				<span className="flex items-center gap-1.5 text-primary">
					<Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
				</span>
			)}
			{syncStatus === "unsaved" && (
				<span className="flex items-center gap-1.5 text-warning">
					<AlertCircle className="h-3.5 w-3.5" /> Unsaved
				</span>
			)}
		</div>
	);
};

export default SyncIndicator;
