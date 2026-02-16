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
import { LayoutPreview } from "@/components/layout-preview";
import { ThemePreview } from "@/components/theme-preview";

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
			theme: "dark" as "light" | "dark",
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
