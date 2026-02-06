import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { client } from "./orpc-client";

export const orpcQuery = createTanstackQueryUtils(client);
