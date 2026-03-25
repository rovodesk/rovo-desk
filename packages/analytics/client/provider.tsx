"use client";

import { PostHogProvider } from "@posthog/react";
import { type PostHogConfig, posthog } from "posthog-js";
import type React from "react";
import { keys } from "./keys";

type AnalyticsProviderProps = {
	readonly children: React.ReactNode;
};

const options: Partial<PostHogConfig> = {
	api_host: keys.VITE_POSTHOG_HOST,
	defaults: "2026-01-30",
	persistence: "localStorage+cookie",
	cookie_persisted_properties: ["interests", "signup_source"],
	cookieless_mode: "on_reject",
	autocapture: false,
	capture_pageview: false,
	session_recording: {
		maskAllInputs: true,
		maskInputOptions: {
			password: true,
		},
		sampleRate: 0.5, // Adjust the sample rate as needed (0.5 means 50% of sessions will be recorded)
	},
	mask_personal_data_properties: true,
};

// Initialize once globally
if (typeof window !== "undefined") {
	posthog.init(keys.VITE_POSTHOG_KEY, options);
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
