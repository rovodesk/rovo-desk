import { useOnboarding } from "@onboardjs/react";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { FieldLabel } from "@zero-heads-lab/design-system/components/ui/field";
import { RadioGroupItem } from "@zero-heads-lab/design-system/components/ui/radio-group";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { useTheme } from "@zero-heads-lab/design-system/context/theme";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { CheckCircle2, Laptop, Moon, Sun } from "lucide-react";
import { z } from "zod";
import { ThemePreview } from "@/components/theme-preview";

// Schema
const appearanceFormSchema = z.object({
	theme: z.enum(["light", "dark"]),
});

export function AppearanceStep({ className }: React.ComponentProps<"div">) {
	const { next, skip } = useOnboarding();
	const { theme, setSystemTheme, setTheme } = useTheme();

	const form = useAppForm({
		validators: { onSubmit: appearanceFormSchema },
		defaultValues: { theme },
		onSubmit: ({ value }) => {
			if (value.theme !== theme) {
				setTheme(value.theme);
			}
			toast.success("Theme preference saved");
			next();
		},
	});

	return (
		<div
			className={cn(
				"fade-in slide-in-from-bottom-4 mx-auto w-full max-w-4xl animate-in px-4 py-8 duration-700",
				className
			)}
		>
			{/* Header */}
			<div className="mb-10 flex flex-col items-center text-center">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
					<Laptop className="size-3" />
					<span>Interface Settings</span>
				</div>
				<h1 className="mb-2 font-bold text-3xl tracking-tight">
					How do you like to work?
				</h1>
				<p className="max-w-md text-muted-foreground">
					Choose the theme that fits your vibe. We'll adapt the entire workspace
					to match your preference.
				</p>
			</div>

			{/* Form & Selection Cards */}
			<form className="mx-auto w-full max-w-2xl" onSubmit={form.handleSubmit}>
				<form.AppForm>
					<form.AppField
						children={(field) => (
							<field.RadioGroupField
								className="grid grid-cols-1 gap-4 sm:grid-cols-2"
								defaultValue={theme}
								onValueChange={(val) => setTheme(val as "light" | "dark")}
								options={[
									{ label: "Light Mode", value: "light" },
									{ label: "Dark Mode", value: "dark" },
								]}
								renderOption={(option) => {
									const isSelected = theme === option.value;
									return (
										<FieldLabel className="w-full cursor-pointer">
											<RadioGroupItem
												className="sr-only"
												value={option.value}
											/>

											{/* The Card Container */}
											<div
												className={cn(
													"group relative flex flex-col gap-3 rounded-2xl border-2 p-2 transition-all duration-200",
													isSelected
														? "border-primary bg-primary/5 ring-1 ring-primary"
														: "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
												)}
											>
												{/* Mini Dashboard Preview */}
												<div className="relative">
													<ThemePreview
														type={option.value as "light" | "dark"}
													/>

													{/* Selected Checkmark Badge */}
													<div
														className={cn(
															"absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 font-medium text-[10px] text-primary-foreground shadow-sm transition-opacity duration-200",
															isSelected ? "opacity-100" : "opacity-0"
														)}
													>
														<CheckCircle2 className="size-3" />
														<span>Active</span>
													</div>
												</div>

												{/* Label Section */}
												<div className="flex items-center justify-between px-2 pb-1">
													<div className="flex items-center gap-2">
														{option.value === "light" ? (
															<Sun className="size-4 text-orange-500" />
														) : (
															<Moon className="size-4 text-[#72e3ad]" />
														)}
														<span className="font-semibold text-sm">
															{option.label}
														</span>
													</div>

													{/* Radio Circle Visual */}
													<div
														className={cn(
															"flex size-4 items-center justify-center rounded-full border transition-colors",
															isSelected
																? "border-primary bg-primary"
																: "border-muted-foreground/30"
														)}
													>
														{isSelected && (
															<div className="size-1.5 rounded-full bg-background" />
														)}
													</div>
												</div>
											</div>
										</FieldLabel>
									);
								}}
							/>
						)}
						name="theme"
					/>

					{/* Footer Actions */}
					<div className="mt-10 flex flex-col items-center gap-4">
						<Button
							className="h-12 w-full font-medium text-base shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] sm:w-64"
							onClick={() => {
								form.handleSubmit();
							}}
							type="submit"
						>
							Continue
						</Button>
						<button
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							onClick={() => {
								setSystemTheme();
								skip();
							}}
							type="button"
						>
							Sync with system settings
						</button>
					</div>
				</form.AppForm>
			</form>
		</div>
	);
}
