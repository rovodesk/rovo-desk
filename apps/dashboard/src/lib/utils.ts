import { toast } from "@zero-heads-lab/design-system/components/toast";
import { AxiosError } from "axios";

export function handleServerError(error: unknown) {
	// eslint-disable-next-line no-console
	console.log(error);

	let errMsg = "Something went wrong!";

	if (
		error &&
		typeof error === "object" &&
		"status" in error &&
		Number(error.status) === 204
	) {
		errMsg = "Content not found.";
	}

	if (error instanceof AxiosError) {
		errMsg = error.response?.data.title;
	}

	toast.error(errMsg);
}
