import type { WidgetState } from "@zero-heads-lab/engine";
import type { ComponentType } from "react";
import { WelcomeScreen } from "./welcome";
import { ConversationScreen } from "./conversation";
import { InboxScreen } from "./inbox";
import { HelpScreen } from "./help";
import { PublicationsScreen } from "./publications";

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
