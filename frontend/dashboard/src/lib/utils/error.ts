import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { getErrorStatus } from "@zero-heads-lab/shared/lib/utils";
import { AxiosError } from "axios";

export function handleMutationError(error: unknown) {
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
