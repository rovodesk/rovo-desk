import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { defaultWidgetConfig } from "@zero-heads-lab/shared/defaults";
import type { WidgetConfig } from "@zero-heads-lab/shared/types";
import { WidgetConfigSchema } from "@zero-heads-lab/shared/validations";
import {
	Braces,
	Check,
	ChevronDown,
	Copy,
	RotateCcw,
	Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWidget } from "@/hooks/use-widget";
import { SectionHeader } from "../_components/section-header";
import SectionMain from "../_components/section-main";
import { WidgetPreview } from "./_components/widget-preview";
import { WidgetSidebar } from "./_components/widget-sidebar";

export const WidgetSettings = () => {
	const [showJson, setShowJson] = useState(false);
	const [copied, setCopied] = useState(false);
	const { widget, isLoading, updateWidgetSettingsAsync } = useWidget();

	const form = useAppForm({
		defaultValues: defaultWidgetConfig(),
		validators: {
			onSubmit: WidgetConfigSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateWidgetSettingsAsync({ widgetConfig: value });
				form.reset(value); // Reset "dirty" state after successful save
				toast("Configuration saved", {
					description: "Your widget settings have been saved.",
				});
			} catch {
				toast("Failed to save", { description: "Please try again." });
			}
		},
	});

	// Sync form with external data when widget loads
	useEffect(() => {
		if (widget?.config) {
			form.reset(widget.config);
		}
	}, [widget?.config, form]);

	const handleReset = () => {
		form.reset(defaultWidgetConfig());
		toast("Reset to defaults", {
			description: "All settings have been reset.",
		});
	};

	// biome-ignore lint/suspicious/noExplicitAny: Can vcopy any value
	const copyToClipboard = (values: any) => {
		navigator.clipboard.writeText(JSON.stringify(values, null, 2));
		setCopied(true);
		toast("Copied!", { description: "JSON config copied to clipboard." });
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<SectionMain className="flex h-full flex-col overflow-hidden">
			<form.Subscribe selector={(state) => [state.values, state.isDirty]}>
				{([values, isDirty]) => (
					<>
						{/* Header - Now strictly reactive to 'isDirty' and 'values' */}
						<SectionHeader
							description="Customize your chatbot widget appearance and behavior."
							title="Widget Builder"
						>
							<div className="flex items-center gap-2">
								{isDirty && (
									<Badge
										className="border-warning/20 bg-warning/10 text-warning"
										variant="secondary"
									>
										Unsaved
									</Badge>
								)}

								{widget?.version && (
									<p className="text-muted-foreground text-xs">
										Version: {widget?.version}
									</p>
								)}

								<Button
									disabled={isLoading}
									onClick={() => setShowJson((p) => !p)}
									size="icon"
									variant="ghost"
								>
									<Braces className="h-4 w-4" />
								</Button>

								<Button
									disabled={isLoading}
									onClick={handleReset}
									size="icon"
									variant="ghost"
								>
									<RotateCcw className="h-4 w-4" />
								</Button>

								<Button
									disabled={!isDirty || isLoading} // Fixed: uses reactive isDirty
									onClick={() => form.handleSubmit()}
									size="sm"
								>
									<Save className="mr-2 h-4 w-4" />
									Save
								</Button>
							</div>
						</SectionHeader>

						{/* JSON Preview with Clipboard */}
						{showJson && (
							<Collapsible className="mb-4" defaultOpen>
								<div className="flex items-center gap-2">
									<CollapsibleTrigger className="flex flex-1 items-center justify-between rounded-md border border-border bg-muted/50 px-4 py-2 font-medium text-muted-foreground text-xs hover:text-foreground">
										JSON Configuration
										<ChevronDown className="h-3 w-3" />
									</CollapsibleTrigger>
									<Button
										className="h-9"
										onClick={() => copyToClipboard(values)}
										size="sm"
										variant="outline"
									>
										{copied ? (
											<Check className="h-3 w-3 text-green-500" />
										) : (
											<Copy className="h-3 w-3" />
										)}
										<span className="ml-2 text-xs">Copy</span>
									</Button>
								</div>

								<CollapsibleContent>
									<pre className="scrollbar-thin mt-2 max-h-48 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-[11px] text-muted-foreground">
										{JSON.stringify(values, null, 2)}
									</pre>
								</CollapsibleContent>
							</Collapsible>
						)}

						{/* Builder Layout */}
						<div className="flex flex-1 overflow-hidden rounded-md border border-border">
							<WidgetSidebar
								config={values as WidgetConfig}
								updateConfig={(field, value) => {
									form.setFieldValue(field, value);
								}}
							/>
							<div className="flex flex-1 items-center justify-center overflow-hidden bg-muted/20">
								<WidgetPreview config={values as WidgetConfig} />
							</div>
						</div>
					</>
				)}
			</form.Subscribe>
		</SectionMain>
	);
};
