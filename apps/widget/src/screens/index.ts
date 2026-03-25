import type { WidgetState } from "@zero-heads-lab/engine";
import type { ComponentType } from "react";
import { ConversationScreen } from "./conversation";
import { HelpScreen } from "./help";
import { InboxScreen } from "./inbox";
import { PublicationsScreen } from "./publications";
import { WelcomeScreen } from "./welcome";

export type ScreenComponent = ComponentType<{
	state: WidgetState;
}>;

export const screenRegistry = {
	welcome: WelcomeScreen,
	conversation: ConversationScreen,
	inbox: InboxScreen,
	knowledge_base: HelpScreen,
	publications: PublicationsScreen,
} satisfies Record<string, ScreenComponent>;

export type ScreenKey = keyof typeof screenRegistry;
