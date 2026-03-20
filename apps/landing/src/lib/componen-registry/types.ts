export type Image = {
	id?: string;
	url: string;
	alt: string;
};

export type CTA = {
	id?: string;
	label: string;
	link: string;
	type: 'primary' | 'secondary';
};

export type HeroBlock = {
	id?: string;
	blockType: "hero";

	background: {
		image: Image;
	};

	headline: {
		prefixText: string;
		highlightText: string;
		baseText: string;
		accentText: string;
	};

	subHeadline?: {
		text: string;
		enabled: boolean;
	};

	ctas?: CTA[];
};

export type ProblemBlock = {
	id?: string;
	blockType: "problem";

	title?: string;
	description?: string;
};

export type FeaturesBlock = {
	id?: string;
	blockType: "features";

	features?: {
		title: string;
		description: string;
	}[];
};

export type Section = HeroBlock | ProblemBlock | FeaturesBlock;

export type Page = {
	id?: string;
	title: string;
	slug: string;
	sections: Section[];
};
