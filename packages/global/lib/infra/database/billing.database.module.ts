import { Global, Module } from "@nestjs/common";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import {
	ConnectionName,
	DatabaseService,
	type DataSource,
} from "@zero-heads-lab/database";
import { IDataBaseService } from "@zero-heads-lab/database/adapter";
import { ISecrets } from "@zero-heads-lab/secrets";

import { SecretsModule } from "../secrets.module.js";

@Global()
@Module({
	imports: [
		SecretsModule.forRoot(),
		TypeOrmModule.forRootAsync({
			name: ConnectionName.BILLING,
			imports: [SecretsModule],
			useFactory: async (secrets: ISecrets) => ({
				name: ConnectionName.BILLING,
				type: "postgres",
				url: secrets.DATABASE_URL,
				schema: ConnectionName.BILLING,
				autoLoadEntities: true,
				synchronize: secrets.ENV !== "production",
				logging: secrets.LOG_LEVEL !== "silent",
				ssl: false, // TODO:change if needed in prod
			}),
			inject: [ISecrets],
		}),
	],
	providers: [
		{
			provide: IDataBaseService,
			useFactory: (dataSource: DataSource): IDataBaseService => {
				return new DatabaseService(dataSource);
			},
			inject: [getDataSourceToken(ConnectionName.BILLING)],
		},
	],
	exports: [TypeOrmModule, IDataBaseService],
})
export class BillingDatabaseModule {}
