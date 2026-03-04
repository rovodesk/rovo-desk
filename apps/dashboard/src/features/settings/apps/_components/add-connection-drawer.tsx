/** biome-ignore-all lint/style/noNestedTernary: Need to fix ui */
import {
	IconCircleCheckFilled,
	IconMail,
	IconPhone,
} from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@zero-heads-lab/design-system/components/ui/card";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Check, ChevronLeft, Copy, Globe, IdCard } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useChatbot } from "@/hooks/use-chatbot";
import {
	CONNECTION_MAP,
	CONNECTIONS,
	type ConnectionKey,
} from "./connection-map";

const baseSchema = z.object({
	connectionName: z.string().min(1, "Name is required").max(100),
	connectionIcon: z.enum(
		Object.keys(CONNECTION_MAP) as [ConnectionKey, ...ConnectionKey[]]
	),
	connectionSource: z.string(),
});

const formSchema = baseSchema.superRefine((data, ctx) => {
	const config = CONNECTION_MAP[data.connectionIcon];

	if (!config) return;

	const source = data.connectionSource;

	switch (config.source) {
		case "url":
			if (!z.url().safeParse(source).success) {
				ctx.addIssue({
					code: "custom",
					message: "Please enter a valid URL (https://...)",
					path: ["connectionSource"],
				});
			}
			break;

		case "phone":
			if (!/^\+?[1-9]\d{1,14}$/.test(source)) {
				ctx.addIssue({
					code: "custom",
					message: "Enter a valid E.164 phone number",
					path: ["connectionSource"],
				});
			}
			break;

		case "email":
			if (!z.string().email().safeParse(source).success) {
				ctx.addIssue({
					code: "custom",
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

type GeneratedKey = { value: string; type: "public" | "private" } | null;

type Step = 1 | 2 | 3; // Step 1: Platform, Step 2: Details, Step 3: Secret Reveal

export const AddConnection = () => {
	const [step, setStep] = useState<Step>(1);
	const [generatedKey, setGeneratedKey] = useState<GeneratedKey>(null);
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

				const config = CONNECTION_MAP[iconKey];
				if (!config) return;

				const payload = {
					...value,
					connectionType: config.type,
				};

				const data = await createConnectionAsync(payload);

				if (data?.key && typeof data.key === "string") {
					setGeneratedKey({
						value: data.key,
						type: "public",
					});
					setStep(3);
					return;
				}

				toast.success("Connection established!");
				router.navigate({ to: "/settings/apps" });
			} catch {
				toast.error("Failed to create connection");
			}
		},
	});

	/* ------------------------------------------------ */
	/* ---------------- Derived State ----------------- */
	/* ------------------------------------------------ */

	const selectedIconKey = form.state.values.connectionIcon;
	const iconConfig = CONNECTION_MAP[selectedIconKey];

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

	return (
		<Card>
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
				<div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
			</div>

			<CardHeader className="border-white/5 border-b px-10 pt-10 pb-6">
				<div className="mx-auto w-full max-w-2xl space-y-6">
					<h2 className="font-bold text-3xl text-white tracking-tight">
						{step === 1 && "Select Platform"}
						{step === 2 && `Setup ${iconConfig?.label}`}
						{step === 3 && "Secure Your Key"}
					</h2>

					<p className="text-slate-400">
						{step === 1 && "Choose the integration source."}
						{step === 2 && "Provide identity and endpoint details."}
						{step === 3 && "This secret key will only be shown once."}
					</p>

					<StepIndicator current={step} />
				</div>
			</CardHeader>

			{/* Content */}
			<CardContent className="flex-1 overflow-y-auto px-10 py-8">
				<div className="mx-auto w-full max-w-2xl">
					<form.AppForm>
						{/* ---------------- STEP 1 ---------------- */}

						{step === 1 && (
							<div className="fade-in zoom-in-95 animate-in space-y-8 duration-500">
								<form.AppField name="connectionIcon">
									{(field) => (
										<div className="grid grid-cols-3 gap-3">
											{Object.entries(CONNECTION_MAP).map(([key, config]) => {
												const selected = field.state.value === key;

												return (
													<button
														className={`group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border transition-all duration-300 ${
															selected
																? "border-[#72e3ad] bg-[#72e3ad]/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
																: "border-white/5 bg-white/2 hover:scale-[1.03] hover:border-white/15 hover:bg-white/4 active:scale-[0.98]"
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
																selected ? "text-[#72e3ad]" : "text-slate-400"
															}`}
														/>

														<span className="font-semibold text-[11px] text-slate-400 uppercase tracking-widest group-hover:text-white">
															{config.label}
														</span>

														{selected && (
															<IconCircleCheckFilled className="absolute top-2 right-2 h-4 w-4 text-[#72e3ad]" />
														)}
													</button>
												);
											})}
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
								<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#72e3ad]/20 text-[#72e3ad] shadow-[0_0_50px_rgba(99,102,241,0.3)]">
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
									<code className="block break-all text-left font-mono text-[#72e3ad] text-sm">
										{generatedKey.value}
									</code>

									<button
										className="absolute top-3 right-3 rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
										onClick={() => copyToClipboard(generatedKey.value)}
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
									className="w-full rounded-2xl bg-[#72e3ad] py-4 font-bold text-white transition-all hover:bg-[#72e3ad]/80"
									onClick={() => router.navigate({ to: "/settings/apps" })}
									type="button"
								>
									I've Secured the Key
								</button>
							</div>
						)}
					</form.AppForm>
				</div>
			</CardContent>
			{/* Footer Actions */}
			<CardFooter>
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
			</CardFooter>
		</Card>
	);
};

function StepIndicator({ current }: { current: number }) {
	const steps = ["Platform", "Details", "Secure"];
	return (
		<div className="flex justify-between">
			{steps.map((label, i) => (
				<div className="flex flex-col items-center gap-3" key={label}>
					<div
						className={`h-1.5 w-24 rounded-full transition-all duration-500 ${current >= i + 1 ? "bg-[#72e3ad] shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-white/5"}`}
					/>
					<span
						className={`font-black text-[10px] uppercase tracking-[0.2em] ${current === i + 1 ? "text-[#72e3ad]" : "text-slate-600"}`}
					>
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
