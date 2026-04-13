// import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
// import { Button } from "@zero-heads-lab/design-system/components/ui/button";
// import {
// 	Collapsible,
// 	CollapsibleContent,
// 	CollapsibleTrigger,
// } from "@zero-heads-lab/design-system/components/ui/collapsible";
// import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
// import {
// 	Braces,
// 	Check,
// 	ChevronDown,
// 	Copy,
// 	RotateCcw,
// 	Save,
// } from "lucide-react";
// import { useState } from "react";
// // import { useWidget } from "@/providers/widget";
// import { SectionHeader } from "../_components/section-header";
// import SectionMain from "../_components/section-main";
// import { WidgetPreview } from "./components/widget-preview";
// import { WidgetSidebar } from "./components/widget-sidebar";

// export const WidgetSettings = () => {
// 	const [showJson, setShowJson] = useState(false);
// 	const [copied, setCopied] = useState(false);
// 	// const { config, updateConfig, save, isDirty, loading, reset, version } =
// 	// 	useWidget();

// 	const handleReset = () => {
// 		reset();
// 		toast("Reset to saved", {
// 			description: "All settings have been reset to last saved state.",
// 		});
// 	};

// 	// biome-ignore lint/suspicious/noExplicitAny: Can vcopy any value
// 	const copyToClipboard = (values: any) => {
// 		navigator.clipboard.writeText(JSON.stringify(values, null, 2));
// 		setCopied(true);
// 		toast("Copied!", { description: "JSON config copied to clipboard." });
// 		setTimeout(() => setCopied(false), 2000);
// 	};

// 	if (!config) {
// 		return (
// 			<SectionMain className="flex h-full flex-col items-center justify-center overflow-hidden">
// 				<div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
// 			</SectionMain>
// 		);
// 	}

// 	return (
// 		<SectionMain className="flex h-full flex-col overflow-hidden">
// 			{/* Header */}
// 			<SectionHeader
// 				description="Customize your chatbot widget appearance and behavior."
// 				title="Widget Builder"
// 			>
// 				<div className="flex items-center gap-2">
// 					{isDirty && (
// 						<Badge
// 							className="border-warning/20 bg-warning/10 text-warning"
// 							variant="secondary"
// 						>
// 							Unsaved
// 						</Badge>
// 					)}

// 					{version && (
// 						<p className="text-muted-foreground text-xs">Version: {version}</p>
// 					)}

// 					<Button
// 						disabled={loading}
// 						onClick={() => setShowJson((p) => !p)}
// 						size="icon"
// 						variant="ghost"
// 					>
// 						<Braces className="h-4 w-4" />
// 					</Button>

// 					<Button
// 						disabled={loading || !isDirty}
// 						onClick={handleReset}
// 						size="icon"
// 						variant="ghost"
// 					>
// 						<RotateCcw className="h-4 w-4" />
// 					</Button>

// 					<Button disabled={!isDirty || loading} onClick={save} size="sm">
// 						<Save className="mr-2 h-4 w-4" />
// 						Save
// 					</Button>
// 				</div>
// 			</SectionHeader>

// 			{/* JSON Preview with Clipboard */}
// 			{showJson && (
// 				<Collapsible className="mb-4" defaultOpen>
// 					<div className="flex items-center gap-2">
// 						<CollapsibleTrigger className="flex flex-1 items-center justify-between rounded-md border border-border bg-muted/50 px-4 py-2 font-medium text-muted-foreground text-xs hover:text-foreground">
// 							JSON Configuration
// 							<ChevronDown className="h-3 w-3" />
// 						</CollapsibleTrigger>
// 						<Button
// 							className="h-9"
// 							onClick={() => copyToClipboard(config)}
// 							size="sm"
// 							variant="outline"
// 						>
// 							{copied ? (
// 								<Check className="h-3 w-3 text-green-500" />
// 							) : (
// 								<Copy className="h-3 w-3" />
// 							)}
// 							<span className="ml-2 text-xs">Copy</span>
// 						</Button>
// 					</div>

// 					<CollapsibleContent>
// 						<pre className="scrollbar-thin mt-2 max-h-48 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-[11px] text-muted-foreground">
// 							{JSON.stringify(config, null, 2)}
// 						</pre>
// 					</CollapsibleContent>
// 				</Collapsible>
// 			)}

// 			{/* Builder Layout */}
// 			<div className="flex flex-1 overflow-hidden rounded-md border border-border">
// 				<WidgetSidebar config={config} updateConfig={updateConfig} />
// 				<div className="flex flex-1 items-center justify-center overflow-hidden bg-muted/20">
// 					<WidgetPreview config={config} />
// 				</div>
// 			</div>
// 		</SectionMain>
// 	);
// };
