import type * as Y from "@zero-heads-lab/shared/utils/yjs";
import YPartyKitProvider from "y-partykit/provider";
import { env } from "@/env";

declare const PARTYKIT_HOST: string;

export const partyKitProvider = (room: string, doc: Y.Doc) =>
	new YPartyKitProvider(
		env.VITE_PARTYKIT_URL,
		room, // only the ID
		doc,
		{
			prefix: "ws/document", // full prefix
			params: {
				documentId: room,
			},
		}
	);
