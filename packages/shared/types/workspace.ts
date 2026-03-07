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
