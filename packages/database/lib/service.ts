import type { DataSource } from "typeorm";
import { IDataBaseService } from "./adapter.js";

export class DatabaseService extends IDataBaseService {
	constructor(private readonly dataSource: DataSource) {
		super();
	}

	async getDefaultConnection(): Promise<DataSource> {
		if (!this.dataSource.isInitialized) {
			await this.dataSource.initialize();
		}

		return this.dataSource;
	}
}
