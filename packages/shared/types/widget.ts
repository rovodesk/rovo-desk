import type {
	ConversationConfigSchema,
	KnowledgeBaseConfigSchema,
	PublicationsConfigSchema,
	TabTypeSchema,
	WelcomeConfigSchema,
	WidgetAdvancedConfigSchema,
	WidgetAppearanceSchema,
	WidgetConfigSchema,
	WidgetLauncherSchema,
	WidgetModeSchema,
	WidgetScreenConfigSchema,
	WidgetScreenSchema,
} from "validations/widget";
import type z from "zod";

export type WidgetAppearance = z.infer<typeof WidgetAppearanceSchema>;

export type WidgetLauncher = z.infer<typeof WidgetLauncherSchema>;

export type WidgetAdvancedConfig = z.infer<typeof WidgetAdvancedConfigSchema>;

export type WidgetScreen = z.infer<typeof WidgetScreenSchema>;

export type WidgetScreenConfig = z.infer<typeof WidgetScreenConfigSchema>;

export type WidgetConfig = z.infer<typeof WidgetConfigSchema>;

export interface BlockConfigMap {
	welcome: z.infer<typeof WelcomeConfigSchema>;
	conversation: z.infer<typeof ConversationConfigSchema>;
	knowledge_base: z.infer<typeof KnowledgeBaseConfigSchema>;
	publications: z.infer<typeof PublicationsConfigSchema>;
}

export type BlockType = keyof BlockConfigMap;

export interface Block<T extends BlockType = BlockType> {
	id: string;
	type: T;
	enabled: boolean;
	config: BlockConfigMap[T];
}

// export type AnyBlock = z.infer<typeof AnyBlockSchema>;
export type AnyBlock = {
	[K in BlockType]: Block<K>;
}[BlockType];

export type WidgetTabType = z.input<typeof TabTypeSchema>;

export const WidgetTabs = [
	"welcome",
	"conversation",
	"knowledge_base",
	"publications",
];
export const WidgetConfigKeys = [
	"launcher",
	"appearance",
	"screens",
	"advanced",
];

export type WidgetMode = z.infer<typeof WidgetModeSchema>;
