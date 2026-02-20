export const BotHealthItem = ({
	label,
	status,
}: {
	label: string;
	status?: string | null;
}) => {
	const getStatusColor = (status?: string | null) => {
		switch (status?.toLowerCase()) {
			case "healthy":
			case "active":
				return "bg-green-500";
			case "low":
			case "operational":
				return "bg-blue-500";
			case "degraded":
			case "warning":
				return "bg-yellow-500";
			case "down":
			case "error":
				return "bg-red-500";
			default:
				return "bg-muted-foreground/30"; // Empty/Unknown state color
		}
	};

	return (
		<div className="flex items-center justify-between text-sm">
			<span className="text-muted-foreground">{label}</span>
			<div className="flex items-center gap-2">
				<div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
				<span className="font-medium">
					{status || (
						<span className="text-muted-foreground/50 italic">Unknown</span>
					)}
				</span>
			</div>
		</div>
	);
};

export default BotHealthItem;
