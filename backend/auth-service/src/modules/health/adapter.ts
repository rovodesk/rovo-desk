import type { HealthResponse } from "./types";

export abstract class IHealthService {
	abstract getHealth(): Promise<HealthResponse>;
	abstract isReady(): Promise<boolean>;
}
