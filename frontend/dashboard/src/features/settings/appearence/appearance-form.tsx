import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { fonts, useFont } from "@zero-heads-lab/design-system/context/font";
import { useTheme } from "@zero-heads-lab/design-system/context/theme";
import { capitalize } from "@zero-heads-lab/shared/lib/utils";
import { Sparkles, TypeIcon } from "lucide-react";
import { z } from "zod";
import { ThemePreview } from "@/components/theme-preview";
import { SettingRow } from "../_components/setting-row";

const appearanceFormSchema = z.object({
	theme: z.enum(["light", "dark"]),
	font: z.enum(fonts),
});

export function AppearanceForm() {
	const { font, setFont } = useFont();
	const { theme, setTheme } = useTheme();

	const form = useAppForm({
		validators: { onSubmit: appearanceFormSchema },
		defaultValues: {
			theme,
			font,
		},
		onSubmit: ({ value }) => {
			if (value.font !== font) setFont(value.font);
			if (value.theme !== theme) setTheme(value.theme);

			toast.success("Appearance updated", {
				description: "Your dashboard preferences have been saved.",
			});
		},
	});

	return (
		<form
			className="mx-auto max-w-4xl space-y-8"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				{/* SECTION HEADER */}
				<div className="mb-6 flex items-center gap-2">
					<div className="rounded-lg bg-primary/5 p-2">
						<Sparkles className="size-5 text-primary" />
					</div>
					<div>
						<h2 className="font-semibold text-lg tracking-tight">
							Interface Preferences
						</h2>
						<p className="text-muted-foreground text-sm">
							Manage how your workspace looks and feels.
						</p>
					</div>
				</div>

				{/* SETTINGS GROUP */}
				<div className="overflow-hidden rounded-xl border bg-card">
					<div className="divide-y divide-border px-6">
						{/* THEME ROW */}
						<SettingRow
							description="Select between light and dark modes or sync with your system."
							label="Interface Theme"
						>
							<div className="w-full max-w-[400px] py-2">
								<form.AppField
									children={(field) => (
										<field.RadioGroupField
											className="grid grid-cols-2 gap-4"
											options={[
												{ label: "Light", value: "light" },
												{ label: "Dark", value: "dark" },
											]}
											renderOption={(option) => (
												<div className="group relative cursor-pointer">
													<ThemePreview
														type={option.value as "light" | "dark"}
													/>
													<div className="mt-2 flex items-center justify-center gap-1.5">
														<div className="size-1.5 rounded-full bg-transparent group-data-[state=checked]:bg-primary" />
														<span className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider group-data-[state=checked]:text-foreground">
															{option.label}
														</span>
													</div>
												</div>
											)}
										/>
									)}
									name="theme"
								/>
							</div>
						</SettingRow>

						{/* FONT ROW */}
						<SettingRow
							description="Choose the font family that best suits your reading preference."
							label="Typography"
						>
							<div className="w-full max-w-[240px]">
								<form.AppField
									children={(field) => (
										<field.SelectField
											icon={<TypeIcon className="size-4" />}
											options={fonts.map((f) => ({
												label: capitalize(f),
												value: f,
											}))}
											placeholder="Select a font"
										/>
									)}
									name="font"
								/>
							</div>
						</SettingRow>
					</div>
				</div>

				{/* FOOTER ACTIONS */}
				<div className="flex items-center justify-between pt-4">
					<p className="text-muted-foreground text-xs">
						Settings are applied immediately to your local session.
					</p>
					<div className="flex items-center gap-3">
						<form.ResetButton label="Discard" size="sm" variant="ghost" />
						<form.SubmitButton
							className="px-6 shadow-sm"
							label="Save changes"
							size="sm"
						/>
					</div>
				</div>
			</form.AppForm>
		</form>
	);
}
