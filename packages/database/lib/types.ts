import type {
	DataSourceOptions,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	ObjectLiteral,
	SaveOptions,
} from "typeorm";

export type ConnectionModel = DataSourceOptions;

export type CreatedModel = {
	id: string | number;
	created: boolean;
};

export type RemovedModel = {
	deletedCount: number;
	deleted: boolean;
};

export type UpdatedModel = {
	affected: number;
	updated: boolean;
};

export type RepositoryFindWhere<T extends ObjectLiteral> = FindOptionsWhere<T>;
export type RepositoryFindManyOptions<T extends ObjectLiteral> =
	FindManyOptions<T>;
export type RepositoryFindOneOptions<T extends ObjectLiteral> =
	FindOneOptions<T>;
export type RepositorySaveOptions = SaveOptions;

export enum ConnectionName {
	AUTH = "auth",
	BILLING = "billing",
}
