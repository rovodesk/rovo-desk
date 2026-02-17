"use client";

import {
	IconBrandGolang,
	IconBrandPython,
	IconBrandReact,
	IconBrandShopee,
	IconBrandWix,
	IconBrandWordpress,
	IconSettingsAutomation,
	IconTerminal2,
	IconWorld,
} from "@tabler/icons-react";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@zero-heads-lab/design-system/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import {
	ArrowLeft,
	Check,
	Clipboard,
	ClipboardCheck,
	KeyIcon,
	Verified,
	Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";

type Step = 1 | 2 | 3;
type SourceType = "application" | "framework" | null;
type Selection =
	| "react"
	| "python"
	| "go"
	| "wix"
	| "shopify"
	| "wordpress"
	| null;

export const AddSource = () => {
	const [step, setStep] = useState<Step>(1);
	const [sourceType, setSourceType] = useState<SourceType>(null);
	const [selection, setSelection] = useState<Selection>(null);
	const [status, setStatus] = useState<"idle" | "copied">("idle");

	const apiKey = "sk_live_51MzS03LpX9...";

	useEffect(() => {
		if (status === "copied") {
			const timer = setTimeout(() => setStatus("idle"), 1500);
			return () => clearTimeout(timer);
		}
	}, [status]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(apiKey);
		setStatus("copied");
	};

	const handleTypeSelect = (type: SourceType) => {
		setSourceType(type);
		setStep(2);
	};

	const handlePlatformSelect = (id: Selection) => {
		setSelection(id);
		setStep(3);
	};

	const goBack = () => {
		if (step === 3) setStep(2);
		else if (step === 2) {
			setStep(1);
			setSourceType(null);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
			<Header className="border-b bg-white px-8 py-4 dark:bg-slate-900">
				<div className="mx-auto flex w-full max-w-5xl items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl tracking-tight">Add Source</h1>
						<p className="text-muted-foreground text-sm">
							Connect your Chatbot to external data sources to expand its
							knowledge base.
						</p>
					</div>
					<div className="flex gap-3">
						<Button onClick={() => window.history.back()} variant="outline">
							Cancel
						</Button>
						{step === 3 && (
							<Button className="shadow-lg shadow-primary/20">
								Finish Setup
							</Button>
						)}
					</div>
				</div>
			</Header>

			<MainContent className="pt-10">
				<div className="mx-auto max-w-3xl space-y-8">
					{/* Enhanced Step Indicator */}
					<nav className="flex items-center justify-between px-4">
						<StepIndicator current={step} />
					</nav>

					{/* STEP 1: TYPE */}
					{step === 1 && (
						<div className="fade-in slide-in-from-bottom-4 grid animate-in gap-6 duration-500">
							<div className="space-y-2 text-center">
								<h2 className="font-semibold text-xl">
									What are you connecting?
								</h2>
								<p className="text-muted-foreground">
									Select the environment where your data lives.
								</p>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								<TypeCard
									active={sourceType === "application"}
									description="Sync content from CMS or e-commerce platforms like Shopify."
									icon={<IconWorld className="h-8 w-8 text-blue-500" />}
									onClick={() => handleTypeSelect("application")}
									title="Web Application"
								/>
								<TypeCard
									active={sourceType === "framework"}
									description="Directly integrate into your codebase using our native libraries."
									icon={<IconTerminal2 className="h-8 w-8 text-purple-500" />}
									onClick={() => handleTypeSelect("framework")}
									title="Developer SDK"
								/>
							</div>
						</div>
					)}

					{/* STEP 2: PLATFORM */}
					{step === 2 && (
						<div className="fade-in zoom-in-95 animate-in space-y-6 duration-300">
							<div className="flex items-center gap-4">
								<Button
									className="rounded-full"
									onClick={goBack}
									size="icon"
									variant="ghost"
								>
									<ArrowLeft className="h-4 w-4" />
								</Button>
								<h2 className="font-semibold text-xl">Choose your platform</h2>
							</div>

							<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
								{sourceType === "application" ? (
									<>
										<PlatformCard
											icon={
												<IconBrandShopee className="text-[#95BF47]" size={32} />
											}
											label="Shopify"
											onClick={() => handlePlatformSelect("shopify")}
										/>
										<PlatformCard
											icon={
												<IconBrandWordpress
													className="text-[#21759B]"
													size={32}
												/>
											}
											label="WordPress"
											onClick={() => handlePlatformSelect("wordpress")}
										/>
										<PlatformCard
											icon={<IconBrandWix size={32} />}
											label="Wix"
											onClick={() => handlePlatformSelect("wix")}
										/>
									</>
								) : (
									<>
										<PlatformCard
											icon={
												<IconBrandReact className="text-[#61DAFB]" size={32} />
											}
											label="React"
											onClick={() => handlePlatformSelect("react")}
										/>
										<PlatformCard
											icon={
												<IconBrandPython className="text-[#3776AB]" size={32} />
											}
											label="Python"
											onClick={() => handlePlatformSelect("python")}
										/>
										<PlatformCard
											icon={
												<IconBrandGolang className="text-[#00ADD8]" size={32} />
											}
											label="Go Lang"
											onClick={() => handlePlatformSelect("go")}
										/>
									</>
								)}
							</div>
						</div>
					)}

					{/* STEP 3: CONNECT */}
					{step === 3 && (
						<Card className="fade-in slide-in-from-right-8 animate-in border-2 border-primary/10 shadow-xl duration-500">
							<CardHeader className="border-b">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="rounded-lg border p-2 shadow-sm">
											{/* Dynamic Icon based on selection */}
											<IconSettingsAutomation className="h-5 w-5 text-primary" />
										</div>
										<div>
											<CardTitle className="text-lg capitalize">
												{selection} Integration
											</CardTitle>
											<CardDescription>
												Finalize the connection to your source
											</CardDescription>
										</div>
									</div>
									<Button
										className="text-xs"
										onClick={goBack}
										size="sm"
										variant="ghost"
									>
										Change Platform
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6 pt-6">
								{sourceType === "framework" ? (
									<div className="space-y-4">
										<div className="flex gap-3 rounded-xl border p-4">
											<Zap className="h-5 w-5 shrink-0" />
											<p className="text-sm">
												Use this API key in your <code>.env</code> file to
												authenticate your {selection} application.
											</p>
										</div>
										<div className="space-y-2">
											<Label htmlFor="api-key">Your Project API Key</Label>
											<div className="relative">
												<InputGroup className="bg-slate-50 p-2">
													<InputGroupAddon>
														<KeyIcon className="h-4 w-4" />
													</InputGroupAddon>
													<InputGroupInput
														className="pr-24 font-mono text-muted-foreground text-xs"
														id="api-key"
														readOnly
														value={apiKey}
													/>
													<InputGroupButton
														className="bg-muted-foreground/20"
														onClick={handleCopy}
													>
														<AnimatePresence mode="wait">
															<motion.div
																animate={{ opacity: 1, scale: 1 }}
																exit={{ opacity: 0, scale: 0.6 }}
																initial={{ opacity: 0, scale: 0.6 }}
																key={status}
																transition={{
																	type: "spring",
																	stiffness: 400,
																	damping: 30,
																}}
															>
																{status === "idle" ? (
																	<Clipboard size={16} strokeWidth={2.5} />
																) : (
																	<ClipboardCheck
																		className="text-green-500"
																		size={16}
																		strokeWidth={2.5}
																	/>
																)}
															</motion.div>
														</AnimatePresence>
													</InputGroupButton>
												</InputGroup>
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="space-y-2">
											<Label>Store or Site URL</Label>
											<InputGroup className="p-2">
												<InputGroupInput placeholder="https://your-store.myshopify.com" />
												<InputGroupButton className="bg-muted-foreground/20">
													<Verified className="text-green-500" />
													Verify
												</InputGroupButton>
											</InputGroup>
										</div>
										<div className="rounded-lg border p-4">
											<h4 className="mb-2 font-semibold text-sm">
												Instructions:
											</h4>
											<ol className="ml-4 list-decimal space-y-2 text-muted-foreground text-xs">
												<li>
													Install our official plugin from the {selection}{" "}
													marketplace.
												</li>
												<li>Navigate to Settings &gt; AI Integrations.</li>
												<li>
													Paste the connection token provided in the next step.
												</li>
											</ol>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</MainContent>
		</div>
	);
};

// --- Sub-components ---

function StepIndicator({ current }: { current: number }) {
	const steps = ["Source Type", "Platform", "Connection"];
	return (
		<div className="relative mx-auto flex w-full max-w-md items-center justify-between">
			<div className="absolute top-1/2 left-0 -z-10 h-0.5 w-full" />
			{steps.map((s, i) => {
				const stepNum = i + 1;
				const isDone = current > stepNum;
				const isActive = current === stepNum;
				return (
					<div className="flex flex-col items-center gap-2 px-2" key={s}>
						<div
							className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
								isDone
									? "border-primary bg-primary"
									: // biome-ignore lint/style/noNestedTernary: UI demands
										isActive
										? "border-primary text-primary ring-4 ring-primary/10"
										: "text-muted-foreground"
							}`}
						>
							{isDone ? <Check className="h-4 w-4" /> : stepNum}
						</div>
						<span
							className={`font-bold text-[10px] uppercase tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}
						>
							{s}
						</span>
					</div>
				);
			})}
		</div>
	);
}

function TypeCard({
	title,
	description,
	icon,
	active,
	onClick,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			className={`flex flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
				active
					? "border-primary shadow-md ring-2 ring-primary/5"
					: "border-accent shadow-sm hover:border-primary/40"
			}`}
			onClick={onClick}
		>
			<div className="mb-4 w-fit rounded-xl p-3">{icon}</div>
			<h3 className="mb-1 font-bold text-lg">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{description}
			</p>
		</button>
	);
}

function PlatformCard({
	icon,
	label,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<Card
			className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
			onClick={onClick}
		>
			<CardContent className="flex flex-col items-center justify-center gap-3 p-6">
				<div className="transition-transform duration-300 group-hover:scale-110">
					{icon}
				</div>
				<span className="font-medium text-sm">{label}</span>
			</CardContent>
		</Card>
	);
}
