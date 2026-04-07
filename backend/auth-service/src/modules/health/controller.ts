import { Controller, Get, Inject } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { IHealthService } from "./adapter";
import { SwagggerResponse } from "./swagger";
import type { HealthResponse } from "./types";

@ApiTags("Health")
@Controller("Health")
export class HealthController {
	constructor(
		@Inject(IHealthService)
		private readonly healthService: IHealthService
	) {}

	@Get()
	@ApiResponse(SwagggerResponse.getHealth[200])
	@ApiResponse(SwagggerResponse.getHealth[500])
	async getHealth(): Promise<HealthResponse> {
		return await this.healthService.getHealth();
	}

	@Get("ready")
	@ApiResponse({
		status: 200,
		description: "Service is ready",
	})
	@ApiResponse({
		status: 503,
		description: "Service is not ready",
	})
	async isReady(): Promise<{ ready: boolean }> {
		const ready = await this.healthService.isReady();
		return { ready };
	}
}
