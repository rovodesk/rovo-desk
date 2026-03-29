import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Bell, Mail } from "lucide-react";
import { z } from "zod";
import { SettingRow } from "../_components/setting-row";

const notificationsFormSchema = z.object({
	type: z.enum(["all", "mentions", "none"]),
	mobile: z.boolean(),
	communication_emails: z.boolean(),
	social_emails: z.boolean(),
	marketing_emails: z.boolean(),
	security_emails: z.boolean(),
});

export function NotificationsForm() {
	const form = useAppForm({
		defaultValues: {
			type: "all",
			mobile: false,
			communication_emails: false,
			marketing_emails: false,
			social_emails: true,
			security_emails: true,
		},
		validators: { onSubmit: notificationsFormSchema },
		onSubmit: ({ value }) => {
			toast.success("Notification preferences saved.", {
				description: (
					<pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>
				),
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3">
					{/* LEFT COLUMN: GLOBAL DELIVERY */}
					{/* Delivery Mode */}
					<div className="rounded-lg border border-border p-5 lg:col-span-2">
						<div className="mb-1 flex items-center gap-2">
							<Bell className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-base">Delivery Mode</h3>
						</div>
						<p className="mb-4 text-muted-foreground text-sm">
							Decide how and when you want to be interrupted.
						</p>

						<form.AppField
							children={(field) => (
								<field.RadioGroupField
									className="space-y-3"
									description="Primary push notification behavior."
									options={[
										{ label: "All Activity", value: "all" },
										{ label: "Mentions Only", value: "mentions" },
										{ label: "Muted", value: "none" },
									]}
									// Custom rendering for Radio Cards if your design system supports it,
									// otherwise the standard RadioGroupField works fine.
								/>
							)}
							name="type"
						/>

						<Separator className="my-4" />

						<SettingRow
							description="Mirror these settings to your mobile devices."
							label="Push to Mobile"
						>
							<form.AppField
								children={(field) => (
									<field.SwitchField
										description="Mirror these settings to your mobile devices."
										label="Push to Mobile"
									/>
								)}
								name="mobile"
							/>
						</SettingRow>
					</div>

					{/* RIGHT COLUMN: EMAIL GRANULARITY */}
					<div className="rounded-lg border border-border p-5 lg:col-span-1">
						<div className="mb-1 flex items-center gap-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<h3 className="font-semibold text-base">Email Subscriptions</h3>
						</div>
						<p className="mb-4 text-muted-foreground text-sm">
							Manage the noise in your inbox.
						</p>

						<div className="divide-y divide-border">
							<SettingRow
								description="Essential news about your profile."
								label="Account Updates"
							>
								<form.AppField
									children={(field) => (
										<field.SwitchField
											description="Essential news about your profile."
											label="Account Updates"
											size="sm"
										/>
									)}
									name="communication_emails"
								/>
							</SettingRow>
							<SettingRow
								description="Friend requests and interactions."
								label="Social Activity"
							>
								<form.AppField
									children={(field) => (
										<field.SwitchField
											description="Friend requests and interactions."
											label="Social Activity"
											size="sm"
										/>
									)}
									name="social_emails"
								/>
							</SettingRow>
							<SettingRow
								description="Product features and occasional offers."
								label="Marketing & Tips"
							>
								<form.AppField
									children={(field) => (
										<field.SwitchField
											description="Product features and occasional offers."
											label="Marketing & Tips"
											size="sm"
										/>
									)}
									name="marketing_emails"
								/>
							</SettingRow>
							<SettingRow
								description="MFA logs and security alerts. (Recommended)."
								label="Security & Privacy"
							>
								<form.AppField
									children={(field) => (
										<field.SwitchField
											description="MFA logs and security alerts (Recommended)."
											label="Security & Privacy"
											size="sm"
										/>
									)}
									name="security_emails"
								/>
							</SettingRow>
						</div>
					</div>
				</div>

				<div className="mt-10 flex items-center justify-between border-t pt-8">
					<p className="text-muted-foreground text-xs">
						Looking for Desktop notifications? Check your browser settings.
					</p>
					<form.SubmitButton
						className="px-10"
						label="Save Preferences"
						size="lg"
					/>
				</div>
			</form.AppForm>
		</form>
	);
}
