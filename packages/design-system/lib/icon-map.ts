import {
	IconBrandReact,
	IconBrandReactNative,
	IconBrandShopee,
	IconBrandWhatsappFilled,
	IconBrandWix,
	IconBrandWordpress,
	type IconProps,
} from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const ICON_MAP: Record<
	string,
	ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
> = {
	whatsapp: IconBrandWhatsappFilled,
	react: IconBrandReact,
	reactNative: IconBrandReactNative,
	shopify: IconBrandShopee,
	wordpress: IconBrandWordpress,
	wix: IconBrandWix,
};
