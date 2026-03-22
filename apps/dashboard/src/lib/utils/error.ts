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

>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
