export const ALL_USER_COLORS: string[] = [
<<<<<<< HEAD
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
=======
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
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
];

export const DEFAULT_USER_COLOR = "#000000";

function hashString(str: string): number {
<<<<<<< HEAD
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
=======
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
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
}
