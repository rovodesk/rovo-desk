/** biome-ignore-all lint/style/noNestedTernary: Need to fix ui */
import {
	IconCircleCheckFilled,
	IconMail,
	IconPhone,
} from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Check, ChevronLeft, Copy, Globe, IdCard } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useChatbot } from "@/hooks/use-chatbot";
import {
	CONNECTION_ICONS_MAP,
	CONNECTIONS,
	type ConnectionIconKey,
} from "../_components/connection-map";

const baseSchema = z.object({
	connectionName: z.string().min(1, "Name is required").max(100),
	connectionIcon: z.enum(
		Object.keys(CONNECTION_ICONS_MAP) as [
			ConnectionIconKey,
			...ConnectionIconKey[],
		]
	),
	connectionSource: z.string(),
});

export const formSchema = baseSchema.superRefine((data, ctx) => {
	const config = CONNECTION_ICONS_MAP[data.connectionIcon];

	if (!config) return;

	const source = data.connectionSource;

	switch (config.source) {
		case "url":
			if (!z.string().url().safeParse(source).success) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Please enter a valid URL (https://...)",
					path: ["connectionSource"],
				});
			}
			break;

		case "phone":
			if (!/^\+?[1-9]\d{1,14}$/.test(source)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Enter a valid E.164 phone number",
					path: ["connectionSource"],
				});
			}
			break;

		case "email":
			if (!z.string().email().safeParse(source).success) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Enter a valid email",
					path: ["connectionSource"],
				});
			}
			break;

		default:
			break;
	}
});

const sourceMeta = {
	url: {
		label: "Endpoint URL",
		icon: <Globe className="h-5 w-5 opacity-50" />,
		placeholder: "https://...",
	},
	phone: {
		label: "Phone Number",
		icon: <IconPhone className="h-5 w-5 opacity-50" />,
		placeholder: "+1...",
	},
	email: {
		label: "Email Address",
		icon: <IconMail className="h-5 w-5 opacity-50" />,
		placeholder: "hello@...",
	},
};

type Step = 1 | 2 | 3; // Step 1: Platform, Step 2: Details, Step 3: Secret Reveal

export const AddConnection = () => {
	const [step, setStep] = useState<Step>(1);
	const [generatedKey, setGeneratedKey] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const router = useRouter();
	const { createConnectionAsync } = useChatbot();

	const form = useAppForm({
		defaultValues: {
			connectionName: "",
			connectionSource: "",
			// biome-ignore lint/suspicious/noExplicitAny: Invalid type inference from zod
			connectionIcon: CONNECTIONS[0] as any,
		},
		validators: { onSubmit: formSchema },
		onSubmit: async ({ value }) => {
			try {
				const iconKey = value.connectionIcon;

				if (!iconKey) return;

				const config = CONNECTION_ICONS_MAP[iconKey];
				if (!config) return;

				const payload = {
					...value,
					connectionType: config.type,
				};

				const data = await createConnectionAsync(payload);

				if (data?.privateKey || data?.publicKey) {
					setGeneratedKey(data.privateKey ?? data.publicKey ?? null);
					setStep(3);
					return;
				}

				toast.success("Connection established!");
				router.navigate({ to: "/bot" });
			} catch {
				toast.error("Failed to create connection");
			}
		},
	});

	/* ------------------------------------------------ */
	/* ---------------- Derived State ----------------- */
	/* ------------------------------------------------ */

	const selectedIconKey = form.state.values.connectionIcon;
	const iconConfig = CONNECTION_ICONS_MAP[selectedIconKey];

	const sourceUI = iconConfig ? sourceMeta[iconConfig.source] : sourceMeta.url;

	/* ------------------------------------------------ */
	/* ---------------- Step Control ------------------ */
	/* ------------------------------------------------ */

	const handleNext = async () => {
		if (step === 1) {
			setStep(2);
			return;
		}

		if (step === 2) {
			const nameValid = await form.validateField("connectionName", "submit");

			const sourceValid = await form.validateField(
				"connectionSource",
				"submit"
			);

			if (!(nameValid && sourceValid)) return;

			form.handleSubmit();
		}
	};

	const handleBack = () => setStep((prev) => (prev - 1) as Step);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		toast.success("Key copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	/* ------------------------------------------------ */
	/* ------------------- RENDER --------------------- */
	/* ------------------------------------------------ */

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#09090b] p-4 text-slate-200">
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
				<div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
			</div>

			<div className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121214]/80 shadow-2xl backdrop-blur-2xl">
				<div className="border-white/5 border-b px-10 py-8">
					<StepIndicator current={step} />
				</div>

				<div className="p-10">
					<form.AppForm>
						{/* ---------------- STEP 1 ---------------- */}

						{step === 1 && (
							<div className="fade-in zoom-in-95 animate-in space-y-8 duration-500">
								<header>
									<h2 className="font-bold text-3xl text-white tracking-tight">
										Select Platform
									</h2>
									<p className="mt-2 text-slate-400">
										Choose the integration source.
									</p>
								</header>

								<form.AppField name="connectionIcon">
									{(field) => (
										<div className="grid grid-cols-3 gap-3">
											{Object.entries(CONNECTION_ICONS_MAP).map(
												([key, config]) => {
													const selected = field.state.value === key;

													return (
														<button
															className={`relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border transition-all ${
																selected
																	? "border-indigo-500 bg-indigo-500/10"
																	: "border-white/5 bg-white/2 hover:border-white/10"
															}`}
															key={key}
															onClick={() => {
																field.handleChange(key);
																setTimeout(handleNext, 100);
															}}
															type="button"
														>
															<config.icon
																className={`h-8 w-8 ${
																	selected
																		? "text-indigo-400"
																		: "text-slate-400"
																}`}
															/>

															<span className="font-bold text-[10px] uppercase tracking-widest">
																{config.label}
															</span>

															{selected && (
																<IconCircleCheckFilled className="absolute top-2 right-2 h-4 w-4 text-indigo-500" />
															)}
														</button>
													);
												}
											)}
										</div>
									)}
								</form.AppField>
							</div>
						)}

						{/* ---------------- STEP 2 ---------------- */}

						{step === 2 && (
							<div className="fade-in slide-in-from-right-4 animate-in space-y-8 duration-500">
								<header>
									<h2 className="font-bold text-3xl text-white tracking-tight">
										Setup {iconConfig?.label}
									</h2>
									<p className="mt-2 text-slate-400">
										Provide identity and endpoint details.
									</p>
								</header>

								<div className="space-y-6">
									<form.AppField name="connectionName">
										{(field) => (
											<div className="space-y-2">
												<Label className="ml-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
													Friendly Name
												</Label>

												<field.TextField
													className="h-14 rounded-2xl border-white/10 bg-white/5"
													icon={<IdCard className="h-5 w-5 opacity-50" />}
													placeholder={`e.g. ${iconConfig?.label} Production`}
												/>
											</div>
										)}
									</form.AppField>

									<form.AppField name="connectionSource">
										{(field) => (
											<div className="space-y-2">
												<Label className="ml-1 font-bold text-slate-500 text-xs uppercase tracking-widest">
													{sourceUI.label}
												</Label>

												<field.TextField
													className="h-14 rounded-2xl border-white/10 bg-white/5"
													icon={sourceUI.icon}
													placeholder={sourceUI.placeholder}
												/>
											</div>
										)}
									</form.AppField>
								</div>
							</div>
						)}

						{/* ---------------- STEP 3 ---------------- */}

						{step === 3 && generatedKey && (
							<div className="zoom-in-95 animate-in space-y-8 text-center duration-500">
								<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
									<Check className="h-10 w-10" />
								</div>

								<header>
									<h2 className="font-bold text-2xl text-white">
										Save your Secret Key
									</h2>
									<p className="mt-2 text-slate-400 text-sm">
										This is only shown once for your security.
									</p>
								</header>

								<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6">
									<code className="block break-all text-left font-mono text-indigo-300 text-sm">
										{generatedKey}
									</code>

									<button
										className="absolute top-3 right-3 rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
										onClick={() => copyToClipboard(generatedKey)}
										type="button"
									>
										{copied ? (
											<Check className="h-4 w-4 text-green-400" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</button>
								</div>

								<button
									className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white transition-all hover:bg-indigo-500"
									onClick={() => router.navigate({ to: "/bot" })}
									type="button"
								>
									I've Secured the Key
								</button>
							</div>
						)}

						{/* ---------------- FOOTER ---------------- */}

						{step < 3 && (
							<div className="mt-12 flex items-center justify-between border-white/5 border-t pt-8">
								{step > 1 && (
									<button
										className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
										onClick={handleBack}
										type="button"
									>
										<ChevronLeft className="h-4 w-4" />
										Back
									</button>
								)}

								<div className="ml-auto">
									<button
										className="rounded-full bg-white px-8 py-3 font-bold text-black transition-colors hover:bg-slate-200"
										onClick={handleNext}
										type="button"
									>
										{step === 2 ? "Complete Setup" : "Continue"}
									</button>
								</div>
							</div>
						)}
					</form.AppForm>
				</div>
			</div>
		</div>
	);
};

function StepIndicator({ current }: { current: number }) {
	const steps = ["Platform", "Details", "Secure"];
	return (
		<div className="flex justify-between">
			{steps.map((label, i) => (
				<div className="flex flex-col items-center gap-3" key={label}>
					<div
						className={`h-1.5 w-24 rounded-full transition-all duration-500 ${current >= i + 1 ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-white/5"}`}
					/>
					<span
						className={`font-black text-[10px] uppercase tracking-[0.2em] ${current === i + 1 ? "text-indigo-400" : "text-slate-600"}`}
					>
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
