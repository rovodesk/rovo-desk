const avatars = [
	{ name: "HB", image: "https://github.com/haydenbleasel.png" },
	{ name: "CN", image: "https://github.com/shadcn.png" },
	{ name: "LR", image: "https://github.com/leerob.png" },
	{ name: "SC", image: "https://github.com/serafimcloud.png" },
];

export const Avatar = ({ image, name }: { image: string; name: string }) => {
	return (
		<div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-200">
			<img
				alt={name}
				className="h-full w-full object-cover"
				onError={(e) => {
					e.currentTarget.style.display = "none";
					e.currentTarget.parentElement!.innerHTML = `
									<span class='flex h-full w-full items-center justify-center text-xs font-medium text-black'>
										${name}
									</span>
								`;
				}}
				src={image}
			/>
		</div>
	);
};

export const AvatarGroup = () => {
	return (
		<div className="flex items-center -space-x-2">
			{avatars.map((item, idx) => (
				<Avatar image={item.image} key={idx} name={item.name} />
			))}
		</div>
	);
};

export default Avatar;
