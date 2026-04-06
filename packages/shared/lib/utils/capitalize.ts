export function capitalize(value: string) {
	return value.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}
