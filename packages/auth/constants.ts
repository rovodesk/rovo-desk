import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import type { NavigateFn, ReplaceFn } from "./types";

export const defaultReplace: ReplaceFn = (href: string) => {
	window.location.replace(href);
};

export const defaultNavigate: NavigateFn = (href: string) => {
	window.location.href = href;
};

export const defaultToast = {
	success: (message: string) => {
		toast.success(message);
	},
	error: (message: string) => {
		toast.error(message);
	},
};

export type Providers = "google" | "github";
