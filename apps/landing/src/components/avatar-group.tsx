import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";

const avatars = [
	{ name: "HB", image: "https://github.com/haydenbleasel.png" },
	{ name: "CN", image: "https://github.com/shadcn.png" },
	{ name: "LR", image: "https://github.com/leerob.png" },
	{ name: "SC", image: "https://github.com/serafimcloud.png" },
];

export const AvatarGroup = () => (
	<div className="flex items-center">
		<div className="flex -space-x-2">
			{avatars.map((item, idx) => (
				<Avatar
					className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"
					key={idx}
				>
					<AvatarImage src={item.image} />
					<AvatarFallback>{item.name}</AvatarFallback>
				</Avatar>
			))}
		</div>

		<span className="ml-4 font-medium text-slate-400 text-sm">+2k users</span>
	</div>
);
