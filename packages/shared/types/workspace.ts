export type WorkspaceSettings = {
	branding?: {
		logo?: string;
		favicon?: string;
		colors?: {
			brand?: string;
			primary?: string;
			secondary?: string;
			accent?: string;
		};
	};
	locale?: string;
	timezone?: string;
	workingHours?: {
		startTime?: string;
		endTime?: string;
		days?: {
			mon?: boolean;
			tue?: boolean;
			wed?: boolean;
			thu?: boolean;
			fri?: boolean;
			sat?: boolean;
			sun?: boolean;
		};
	};
};

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
