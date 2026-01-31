import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { BellRingIcon, MailIcon } from "lucide-react";
import { z } from "zod";

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
			className="max-w-5xl"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
					{/* LEFT COLUMN: GLOBAL DELIVERY */}
					<div className="space-y-8">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<BellRingIcon className="size-4 text-primary" />
								<h3 className="font-medium text-lg">Delivery Mode</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								Decide how and when you want to be interrupted.
							</p>
						</div>

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

						<div className="rounded-xl border border-dashed bg-muted/30 p-4">
							<form.AppField
								children={(field) => (
									<field.SwitchField
										description="Mirror these settings to your mobile devices."
										label="Push to Mobile"
									/>
								)}
								name="mobile"
							/>
						</div>
					</div>

					{/* RIGHT COLUMN: EMAIL GRANULARITY */}
					<div className="space-y-6">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<MailIcon className="size-4 text-primary" />
								<h3 className="font-medium text-lg">Email Subscriptions</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								Manage the noise in your inbox.
							</p>
						</div>

						<div className="divide-y rounded-xl border bg-card">
							<div className="p-4 transition-colors hover:bg-muted/50">
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
							</div>
							<div className="p-4 transition-colors hover:bg-muted/50">
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
							</div>
							<div className="p-4 transition-colors hover:bg-muted/50">
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
							</div>
							<div className="p-4 transition-colors hover:bg-muted/50">
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
							</div>
						</div>
					</div>
				</div>

				<div className="mt-10 flex items-center justify-between border-t pt-8">
					<p className="text-muted-foreground text-xs">
						Looking for Desktop notifications? Check your browser settings.
					</p>
					<form.SubmitButton className="px-10" size="lg">
						Save Preferences
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
