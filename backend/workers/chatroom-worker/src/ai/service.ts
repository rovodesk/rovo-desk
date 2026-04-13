import type { Env } from "@/types";
import type { IAISercice } from "./adapter";

type AIServiceDeps = {
	env: Env;
};

export class AIService implements IAISercice {
	private env: Env;

	constructor(deps: AIServiceDeps) {
		this.env = deps.env;
	}

	async generateResponse(input: string): Promise<string> {
		const res = await this.env.Bindings.AI.run(this.env.Variables.AI_MODEL, {
			messages: [
				{
					role: "system",
					content: "You are a helpful support assistant.",
				},
				{ role: "user", content: input },
			],
		});

		return String(res.response ?? "");
	}
}
