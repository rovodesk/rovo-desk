import type {
	ConversationConfigSchema,
	KnowledgeBaseConfigSchema,
	PublicationsConfigSchema,
	TabTypeSchema,
	WelcomeConfigSchema,
	WidgetAdvancedConfigSchema,
	WidgetConfigSchema,
	WidgetLauncherAppearanceSchema,
	WidgetScreenConfigSchema,
	WidgetScreenSchema,
	WidgetThemeAppearanceSchema,
} from "validations/widget";
import type z from "zod";

export type WidgetThemeAppearance = z.infer<typeof WidgetThemeAppearanceSchema>;

export type WidgetLauncherAppearance = z.infer<
	typeof WidgetLauncherAppearanceSchema
>;

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

export type TabType = z.input<typeof TabTypeSchema>;
