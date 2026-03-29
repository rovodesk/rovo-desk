import { Building2, Leaf, Rocket, Zap } from "lucide-react";

export type Pricing = {
	name: string;
	price: string;
	description: string;
	features: string[];
	icon: React.ReactNode;
	cta: string;
	variant: "outline" | "default" | "secondary";
	popular?: boolean;
};

export const PRICING: Pricing[] = [
	{
		name: "Basic",
		price: "$0",
		description: "Perfect for hobbyists and side projects.",
		features: ["Up to 3 projects", "Basic analytics", "Community support"],
		icon: <Leaf className="size-5 text-green-500" />,
		cta: "Get Started",
		variant: "outline",
	},
	{
		name: "Pro",
		price: "$49",
		description: "Everything you need to grow your team.",
		features: ["Unlimited projects", "Advanced AI tools", "Priority support"],
		icon: <Zap className="size-5 text-blue-500" />,
		cta: "Go Pro",
		variant: "default",
		popular: true,
	},
	{
		name: "Startup",
		price: "$100",
		description: "Power tools for scaling startups.",
		features: ["Custom workflows", "Audit logs", "Dedicated manager"],
		icon: <Rocket className="size-5 text-purple-500" />,
		cta: "Scale Up",
		variant: "outline",
	},
	{
		name: "Enterprise",
		price: "Custom",
		description: "Security and scale for large orgs.",
		features: ["SSO & SAML", "Unlimited storage", "24/7 Phone support"],
		icon: <Building2 className="size-5 text-orange-500" />,
		cta: "Contact Sales",
		variant: "secondary",
	},
];
