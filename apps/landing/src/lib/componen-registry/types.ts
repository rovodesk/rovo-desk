export type Image = {
	url: string;
	alt: string;
};

export type CTA = {
	label: string;
	link: string;
};

export type HeroBlock = {
	id: string;
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
	id: string;
	blockType: "problem";

	title?: string;
	description?: string;
};

export type FeaturesBlock = {
	id: string;
	blockType: "features";

	features?: {
		title: string;
		description: string;
	}[];
};

export type ComingSoonBlock = {
	id: string;
	blockType: "comingSoon";

	message?: string;
};

export type Section =
	| HeroBlock
	| ProblemBlock
	| FeaturesBlock
	| ComingSoonBlock;

export type Page = {
	id: string;
	title: string;
	slug: string;
	sections: Section[];
};
