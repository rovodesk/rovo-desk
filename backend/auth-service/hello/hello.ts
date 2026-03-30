export interface HelloResponse {
	message: string;
}

export function getHelloMessage(name: string): HelloResponse {
	return {
		message: `Hello ${name}!`,
	};
}
