import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { FieldLabel } from "@zero-heads-lab/design-system/components/ui/field";
import { RadioGroupItem } from "@zero-heads-lab/design-system/components/ui/radio-group";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { fonts, useFont } from "@zero-heads-lab/design-system/context/font";
import { useLayout } from "@zero-heads-lab/design-system/context/layout";
import { useTheme } from "@zero-heads-lab/design-system/context/theme";
import { capitalize } from "@zero-heads-lab/shared/utils";
import { TypeIcon } from "lucide-react";
import { z } from "zod";

const appearanceFormSchema = z.object({
	theme: z.enum(["light", "dark"]),
	layout: z.enum(["inset", "sidebar", "floating"]),
	font: z.enum(fonts),
});

export function AppearanceForm() {
	const { font, setFont } = useFont();
	const { variant: layout, setVariant: setLayout } = useLayout();
	const { theme, setTheme } = useTheme();

	const form = useAppForm({
		validators: { onSubmit: appearanceFormSchema },
		defaultValues: {
			theme: theme as "light" | "dark",
			font,
			layout,
		},
		onSubmit: ({ value }) => {
			if (value.font !== font) setFont(value.font);
			if (value.theme !== theme) setTheme(value.theme);
			if (value.layout !== layout) setLayout(value.layout);

			form.reset();

			toast.success("Lookin' good!", {
				description: "Your dashboard just got a major glow-up.",
			});
		},
	});

	return (
		<form
			className="max-w-5xl"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
					{/* LEFT COLUMN: Visual Vibe */}
					<div className="space-y-8">
						<div>
							<h3 className="font-medium text-lg">Visual Vibe</h3>
							<p className="text-muted-foreground text-sm">
								Adjust the colors and typography to suit your eyes.
							</p>
						</div>

						<form.AppField
							children={(field) => (
								<field.RadioGroupField
									className="grid grid-cols-2 gap-4"
									description="Switch between light and dark mode. Your eyes will thank you."
									label="Interface Theme"
									options={[
										{ label: "Light", value: "light" },
										{ label: "Dark", value: "dark" },
									]}
									renderOption={(option) => (
										<FieldLabel className="cursor-pointer [&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:ring-primary/20">
											<RadioGroupItem
												className="sr-only"
												value={option.value}
											/>
											<ThemePreview type={option.value as "light" | "dark"} />
											<span className="block w-full pt-2 text-center font-medium text-muted-foreground text-xs group-data-[state=checked]:text-foreground">
												{option.label}
											</span>
										</FieldLabel>
									)}
								/>
							)}
							name="theme"
						/>

						<form.AppField
							children={(field) => (
								<field.SelectField
									description="Choose a font that matches your energy."
									icon={<TypeIcon className="size-4" />}
									label="Typeface"
									options={fonts.map((f) => ({
										label: capitalize(f),
										value: f,
									}))}
								/>
							)}
							name="font"
						/>
					</div>

					{/* RIGHT COLUMN: Structural Layout */}
					<div className="space-y-8">
						<div>
							<h3 className="font-medium text-lg">The Architecture</h3>
							<p className="text-muted-foreground text-sm">
								How do you want to navigate your digital empire?
							</p>
						</div>

						<form.AppField
							children={(field) => (
								<field.RadioGroupField
									className="grid grid-cols-1 gap-4"
									description="Select the structural skeleton of the app."
									label="Dashboard Layout"
									options={[
										{ label: "Sidebar", value: "sidebar" },
										{ label: "Inset", value: "inset" },
										{ label: "Floating", value: "floating" },
									]}
									renderOption={(option) => (
										<FieldLabel className="relative cursor-pointer [&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5">
											<RadioGroupItem
												className="sr-only"
												value={option.value}
											/>
											<div className="flex items-center gap-4 rounded-xl border-2 border-muted p-4 transition-all hover:bg-accent/50">
												<LayoutPreview
													type={
														option.value as "sidebar" | "inset" | "floating"
													}
												/>
												<div className="flex flex-col">
													<span className="font-semibold text-sm">
														{option.label}
													</span>
													<span className="text-muted-foreground text-xs">
														{option.value === "sidebar" &&
															"Classic, reliable, efficient."}
														{option.value === "inset" &&
															"Modern, contained, focused."}
														{option.value === "floating" &&
															"Airy, spacious, experimental."}
													</span>
												</div>
											</div>
										</FieldLabel>
									)}
								/>
							)}
							name="layout"
						/>
					</div>
				</div>

				<div className="mt-12 flex items-center justify-between border-t pt-8">
					<p className="text-muted-foreground text-xs italic">
						* No pixels were harmed in the making of this dashboard.
					</p>
					<form.SubmitButton
						className="px-8 shadow-lg shadow-primary/20"
						size="lg"
					>
						Apply Aesthetics
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}

function ThemePreview({ type }: { type: "light" | "dark" }) {
	const isDark = type === "dark";
	return (
		<div
			className={`rounded-lg border-2 border-muted p-2 transition-all ${isDark ? "bg-slate-950" : "bg-slate-100"}`}
		>
			<div className="space-y-2">
				<div
					className={`h-2 w-12 rounded ${isDark ? "bg-slate-800" : "bg-white"}`}
				/>
				<div className="grid grid-cols-2 gap-1">
					<div
						className={`h-8 rounded ${isDark ? "bg-slate-800" : "bg-white"} shadow-sm`}
					/>
					<div
						className={`h-8 rounded ${isDark ? "bg-slate-800" : "bg-white"} shadow-sm`}
					/>
				</div>
			</div>
		</div>
	);
}

function LayoutPreview({ type }: { type: "sidebar" | "inset" | "floating" }) {
	return (
		<div className="flex h-10 w-12 items-center justify-center rounded-md border border-muted-foreground/20 bg-muted/50">
			{type === "sidebar" && (
				<div className="flex h-full w-full gap-1 p-1">
					<div className="w-1/3 rounded-sm bg-primary/40" />
					<div className="flex-1 rounded-sm bg-primary/10" />
				</div>
			)}
			{type === "inset" && (
				<div className="h-full w-full p-1">
					<div className="h-full w-full rounded-sm border-2 border-primary/40 bg-primary/10" />
				</div>
			)}
			{type === "floating" && (
				<div className="h-full w-full p-2">
					<div className="h-full w-full rounded-full bg-primary/40 shadow-md" />
				</div>
			)}
		</div>
	);
}
