"use client";

import { PostHogProvider } from "@posthog/react";
import type { PostHogConfig } from "posthog-js";
import type React from "react";
import { keys } from "./keys";

type AnalyticsProviderProps = {
    readonly children: React.ReactNode;
};

const options: Partial<PostHogConfig> = {
    api_host: keys.VITE_PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
};

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
    return (
        <PostHogProvider apiKey={keys.VITE_PUBLIC_POSTHOG_KEY} options={options}>
            {children}
        </PostHogProvider>
    );
};
