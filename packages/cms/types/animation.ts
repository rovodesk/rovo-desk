export type EffectPreset =
	| "none"
	| "fade"
	| "slide-up"
	| "slide-left"
	| "scale"
	| "reveal";

export interface AnimationConfig {
	effect?: EffectPreset;
	delay?: number;
	threshold?: number;
}
