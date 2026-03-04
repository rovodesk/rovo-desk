export function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between py-4">
			<div>
				<div className="font-medium text-sm">{label}</div>
				{description && (
					<div className="mt-0.5 text-muted-foreground text-xs">
						{description}
					</div>
				)}
			</div>
			{children}
		</div>
	);
}
