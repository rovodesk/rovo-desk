export interface FeatureItem {
	id: string;
	title: string;
	description: string;
	icons?: boolean;
	href?: string;
	feature?:
		| "chart"
		| "counter"
		| "code"
		| "timeline"
		| "spotlight"
		| "notifications"
		| "typing"
		| "metrics"
		| "animated-list";
	spotlightItems?: string[];
	timeline?: Array<{ year: string; event: string }>;
	code?: string;
	codeLang?: string;
	typingText?: string;
	metrics?: Array<{
		label: string;
		value: number;
		suffix?: string;
		color?: string;
	}>;
	statistic?: {
		value: string;
		label: string;
		start?: number;
		end?: number;
		suffix?: string;
	};
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const featureItems: FeatureItem[] = [
	{
		id: "main",
		title: "Building tomorrow's technology",
		description:
			"We architect and develop enterprise-grade applications that scale seamlessly with cloud-native technologies and microservices.",
		href: "#",
		feature: "spotlight",
		spotlightItems: [
			"Microservices architecture",
			"Serverless computing",
			"Container orchestration",
			"API-first design",
			"Event-driven systems",
		],
		size: "lg",
		className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
	},
	{
		id: "stat1",
		title: "AI Agents & Automation",
		description:
			"Intelligent agents that learn, adapt, and automate complex workflows",
		href: "#",
		feature: "typing",
		typingText:
			"const createAgent = async () => {\n  const agent = new AIAgent({\n    model: 'gpt-4-turbo',\n    tools: [codeAnalysis, dataProcessing],\n    memory: new ConversationalMemory()\n  });\n\n  // Train on domain knowledge\n  await agent.learn(domainData);\n\n  return agent;\n};",
		size: "md",
		className: "col-span-2 row-span-1 col-start-1 col-end-3",
	},
	{
		id: "notifications",
		title: "Get notifications",
		description: "Get notified when something happens.",
		icons: true,
		href: "#",
		feature: "notifications",
		size: "md",
		className: "col-span-1 row-span-1",
	},
	{
		id: "notifications",
		title: "Notifications",
		description: "Get notified when something happens.",
		href: "#",
		feature: "animated-list",
		size: "sm",
		className: "col-span-1 row-span-1",
	},
];
