export const ALL_USER_COLORS: string[] = [
	"#00F5FF",
	"#39FF14",
	"#FF3131",
	"#FF00FF",
	"#FFD300",
	"#00FF85",
	"#7D5FFF",
	"#FF6EC7",
	"#00B3FF",
	"#FF8C00",
];

export const DEFAULT_USER_COLOR = "#000000";

function hashString(str: string): number {
	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) % 2_147_483_647;
	}

	return Math.abs(hash);
}

export function pickUserColor(userId?: string): string {
	if (!userId) return DEFAULT_USER_COLOR;
	const index = hashString(userId) % ALL_USER_COLORS.length;
	return ALL_USER_COLORS[index] ?? DEFAULT_USER_COLOR;
}
