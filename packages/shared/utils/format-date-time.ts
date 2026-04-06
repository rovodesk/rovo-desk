export const formatDateTime = (
	timestamp?: string | Date,
	format: "date" | "datetime" | "time" = "date"
): string => {
	const date = timestamp ? new Date(timestamp) : new Date();

	const pad = (n: number) => n.toString().padStart(2, "0");

	const MM = pad(date.getMonth() + 1);
	const DD = pad(date.getDate());
	const YYYY = date.getFullYear();

	const HH = pad(date.getHours());
	const mm = pad(date.getMinutes());
	const ss = pad(date.getSeconds());

	switch (format) {
		case "datetime":
			return `${MM}/${DD}/${YYYY} ${HH}:${mm}:${ss}`;
		case "time":
			return `${HH}:${mm}:${ss}`;
		default:
			return `${MM}/${DD}/${YYYY}`;
	}
};
