export interface IAISercice {
	generateResponse(input: string): Promise<string>;
}
