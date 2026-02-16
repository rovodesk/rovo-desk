import type { conversations } from "@/data/conversations.json";

export type ChatUser = (typeof conversations)[number];
export type Convo = ChatUser["messages"][number];
