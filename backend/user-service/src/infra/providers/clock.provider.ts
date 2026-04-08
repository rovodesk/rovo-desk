import { Injectable } from "@nestjs/common";
import type { IClockPort } from "@/app/ports/clock.port";

/**
 * ClockProvider
 *
 * Implements IClockPort.
 * Provides system time abstraction for testability.
 *
 * Why abstract time?
 * - Enables deterministic testing (mock time)
 * - Centralizes time source
 * - Allows time synchronization across services later
 */
@Injectable()
export class ClockProvider implements IClockPort {
	/**
	 * Get current UTC time.
	 */
	now(): Date {
		return new Date();
	}
}
