import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { getErrorStatus } from "@zero-heads-lab/shared/utils";
import { AxiosError } from "axios";

export function handleMutationError(error: unknown) {
<<<<<<< HEAD
	// eslint-disable-next-line no-console
	console.log(error);

	let errMsg = "Something went wrong!";
	const errorStatus = getErrorStatus(error);

	if (errorStatus === 204) {
		errMsg = "Content not found.";
	}

	if (errorStatus === 500) {
		errMsg = "Internal server error.";
	}

	if (error instanceof AxiosError) {
		errMsg = error.response?.data.title;
	}

	toast.error("Something went wrong!", {
		description: errMsg,
	});
}

export const ALL_USER_COLORS: string[] = [
	"#00F5FF",
	"#39FF14",
	"#FF3131",
	"#FF00FF",
	"#FFD300",
	"#00FF85",
	"#7D5FFF",
	"#FF6EC7",
	"#00B3FF",
	"#FF8C00",
=======
    // eslint-disable-next-line no-console
    console.log(error);

    let errMsg = "Something went wrong!";
    const errorStatus = getErrorStatus(error);

    if (errorStatus === 204) {
        errMsg = "Content not found.";
    }

    if (errorStatus === 500) {
        errMsg = "Internal server error.";
    }

    if (error instanceof AxiosError) {
        errMsg = error.response?.data.title;
    }

    toast.error("Something went wrong!", {
        description: errMsg,
    });
}

export const ALL_USER_COLORS: string[] = [
    "#00F5FF",
    "#39FF14",
    "#FF3131",
    "#FF00FF",
    "#FFD300",
    "#00FF85",
    "#7D5FFF",
    "#FF6EC7",
    "#00B3FF",
    "#FF8C00",
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
];

export const DEFAULT_USER_COLOR = "#000000";

function hashString(str: string): number {
<<<<<<< HEAD
	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) % 2_147_483_647;
	}

	return Math.abs(hash);
}

export function pickUserColor(userId?: string): string {
	if (!userId) return DEFAULT_USER_COLOR;
	const index = hashString(userId) % ALL_USER_COLORS.length;
	return ALL_USER_COLORS[index] ?? DEFAULT_USER_COLOR;
=======
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 2_147_483_647;
    }

    return Math.abs(hash);
}

export function pickUserColor(userId?: string): string {
    if (!userId) return DEFAULT_USER_COLOR;
    const index = hashString(userId) % ALL_USER_COLORS.length;
    return ALL_USER_COLORS[index] ?? DEFAULT_USER_COLOR;
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
}
