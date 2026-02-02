import { createEnv } from "@t3-oss/env-core";
import { keys as authKeys } from "@zero-heads-lab/auth/keys";
import { keys as cacheKeys } from "@zero-heads-lab/cache/keys";
import { keys as databaseKeys } from "@zero-heads-lab/database/keys";
import { keys as emailKeys } from "@zero-heads-lab/email/keys";

export const env = createEnv({
	extends: [databaseKeys, authKeys, cacheKeys, emailKeys],
	server: {},
	runtimeEnvStrict: {},
});
