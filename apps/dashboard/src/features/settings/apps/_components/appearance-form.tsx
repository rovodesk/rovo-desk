import { ColorPicker } from "@zero-heads-lab/design-system/components/color-picker";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Palette, Paperclip, Send, Type } from "lucide-react";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useChatbot } from "@/hooks/use-chatbot";

const formSchema = z.object({
	botName: z.string().min(2).max(30),
	systemInstruction: z.string().min(2).max(160),
	primaryColor: z.string().min(4),
	secondaryColor: z.string().min(4),
	welcomeMessage: z.string().min(2).max(160),
	inputPlaceholder: z.string().min(2).max(160),
});

export const AppearanceForm = () => {
	const { chatbot, updateSettingsAsync, loading } = useChatbot();

	/* ------------------------------------------------ */
	/* Stable Default Values                           */
	/* ------------------------------------------------ */

	const defaults = useMemo(
		() => ({
			botName: chatbot?.name ?? "",
			systemInstruction: chatbot?.settings?.instruction ?? "",
			primaryColor: chatbot?.settings?.primaryColor ?? "#4f46e5",
			secondaryColor: chatbot?.settings?.secondaryColor ?? "#ffffff",
			welcomeMessage: chatbot?.settings?.welcomeMessage ?? "",
			inputPlaceholder: chatbot?.settings?.inputPlaceholder ?? "",
		}),
		[chatbot]
	);

	const form = useAppForm({
		defaultValues: defaults,
		validators: { onSubmit: formSchema },
		onSubmit: async ({ value }) => {
			if (!chatbot) return;

			try {
				await updateSettingsAsync({
					id: chatbot.id,
					name: value.botName,
					primaryColor: value.primaryColor,
					secondaryColor: value.secondaryColor,
					welcomeMessage: value.welcomeMessage,
					inputPlaceholder: value.inputPlaceholder,
				});

				toast.success("Appearance updated successfully");
			} catch (error) {
				console.error(error);
				toast.error("Failed to update appearance");
			}
		},
	});

	/* ------------------------------------------------ */
	/* Sync When Chatbot Changes                       */
	/* ------------------------------------------------ */

	useEffect(() => {
		if (!chatbot) return;
		form.reset(defaults);
	}, [chatbot, defaults, form.reset]);

	const values = form.state.values;

	if (!chatbot) return null;
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* LEFT PANEL */}
					<div className="space-y-6 lg:col-span-7">
						{/* Instruction */}
						<section className="rounded-xl border p-6 shadow-sm">
							<div className="mb-6 flex items-center gap-2 border-b pb-4">
								<Type size={20} />
								<h2 className="font-semibold text-lg">System Info</h2>
							</div>

							<div className="space-y-4">
								<form.AppField
									children={(field) => (
										<field.TextField label="Bot Name" placeholder="Bot Name" />
									)}
									name="botName"
								/>
								<form.AppField
									children={(field) => (
										<field.TextareaField
											label="System Instruction"
											placeholder="You are a helpful assistant."
											rows={4}
										/>
									)}
									name="systemInstruction"
								/>
							</div>
						</section>

						{/* Branding */}
						<section className="rounded-xl border p-6 shadow-sm">
							<div className="mb-6 flex items-center gap-2 border-b pb-4">
								<Palette size={20} />
								<h2 className="font-semibold text-lg">Branding & Colors</h2>
							</div>

							<div className="grid items-center justify-center gap-6 md:grid-cols-2">
								<form.AppField
									children={(field) => (
										<div>
											<div className="flex gap-2">
												<field.TextField
													className="font-mono"
													icon={
														<ColorPicker
															className="h-6 w-6"
															onChange={(val) => field.handleChange(val)}
															value={field.state.value}
														/>
													}
													iconAlignment="inline-end"
													label="Primary Color"
												/>
											</div>
										</div>
									)}
									name="primaryColor"
								/>

								<form.AppField
									children={(field) => (
										<div>
											<div className="flex gap-2">
												<field.TextField
													className="font-mono"
													icon={
														<ColorPicker
															className="h-6 w-6"
															onChange={(val) => field.handleChange(val)}
															value={field.state.value}
														/>
													}
													iconAlignment="inline-end"
													label="Secondary Color"
												/>
											</div>
										</div>
									)}
									name="secondaryColor"
								/>
							</div>
						</section>

						{/* Text Content */}
						<section className="rounded-xl border p-6 shadow-sm">
							<div className="mb-6 flex items-center gap-2 border-b pb-4">
								<Type size={20} />
								<h2 className="font-semibold text-lg">Chat Interface Text</h2>
							</div>

							<div className="space-y-4">
								<form.AppField
									children={(field) => (
										<field.TextareaField label="Welcome Message" rows={3} />
									)}
									name="welcomeMessage"
								/>

								<form.AppField
									children={(field) => (
										<field.TextField label="Input Placeholder" />
									)}
									name="inputPlaceholder"
								/>
							</div>
						</section>
					</div>

					{/* RIGHT PANEL - LIVE PREVIEW */}
					<div className="lg:col-span-5">
						<div className="sticky top-24">
							<div className="overflow-hidden rounded-3xl border bg-white shadow-2xl">
								<div
									className="flex items-center justify-between p-5 text-white"
									style={{
										backgroundColor: values.primaryColor,
										color: values.secondaryColor,
									}}
								>
									<p className="font-bold text-sm">{values.botName}</p>
								</div>

								<div className="flex h-[400px] flex-col gap-4 bg-slate-50 p-6">
									{/* LEFT (Bot) */}
									<div
										className="max-w-[75%] self-start rounded-2xl rounded-bl-sm p-4 text-sm shadow"
										style={{
											backgroundColor: values.secondaryColor,
											color: values.primaryColor,
										}}
									>
										{values.welcomeMessage}
									</div>

									{/* RIGHT (User) */}
									<div
										className="max-w-[75%] self-end rounded-2xl rounded-br-sm p-4 text-sm shadow"
										style={{
											backgroundColor: values.primaryColor,
											color: values.secondaryColor,
										}}
									>
										I need help with my integration.
									</div>
								</div>

								<div className="flex items-center gap-3 border-t p-5">
									<div className="rounded-full p-2 text-white">
										<Paperclip className="text-muted-foreground" size={16} />
									</div>
									<div className="flex-1 text-gray-400 text-sm italic">
										{values.inputPlaceholder}
									</div>
									<div
										className="rounded-full p-2 text-white"
										style={{
											backgroundColor: values.primaryColor,
										}}
									>
										<Send size={16} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end gap-4 border-t pt-6">
					<Button
						disabled={loading}
						onClick={() => form.reset(defaults)}
						size="lg"
						variant="outline"
					>
						Reset
					</Button>

					<form.SubmitButton
						className="px-8 shadow-lg shadow-primary/20"
						label="Apply Aesthetics"
						size="lg"
					/>
				</div>
			</form.AppForm>
		</form>
	);
};
