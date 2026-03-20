import type { HeroBlock } from "@/lib/componen-registry/types";
import ModernHeroSectionVariant from "./variants/modern";

type Props = {
	data: HeroBlock;
	className?: string;
};

export const HeroSection = ({ data, className }: Props) => {
	return <ModernHeroSectionVariant className={className} data={data} />;
};
