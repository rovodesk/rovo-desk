import type { WorkspaceSettings } from "../types";

export function defaultWorkspaceSettings(logo?: string): WorkspaceSettings {
	return {
		branding: {
			logo,
			favicon: logo,
			colors: {
				brand: "#355872",
				primary: "#7AAACE",
				secondary: "#9CD5FF",
				accent: "#F7F8F0",
			},
		},
		locale: "en",
		timezone: "Asia/Kolkata",
		workingHours: {
			startTime: "09:00",
			endTime: "18:00",
			days: {
				mon: true,
				tue: true,
				wed: true,
				thu: true,
				fri: true,
				sat: false,
				sun: false,
			},
		},
	};
}
