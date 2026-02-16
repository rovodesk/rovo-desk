import { generateUUID } from "@zero-heads-lab/shared/utils";
import * as Y from "@zero-heads-lab/shared/utils/yjs";
import YPartyKitProvider from "y-partykit/provider";
import { env } from "@/env";

declare const PARTYKIT_HOST: string;

const doc = new Y.Doc();

export const partyKitProvider = (fragmentName: string) =>
	new YPartyKitProvider(
		// Host
		env.VITE_PARTYKIT_URL,
		// Room
		fragmentName,
		// YJS doc
		doc,
		// PartyKit Options
		{
			params: {
				connectionId: generateUUID(`${fragmentName}_`),
			},
			prefix: "/ws/knowledge-base",
		}
	);
