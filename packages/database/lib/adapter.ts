import type {
	DataSource,
	DeepPartial,
	EntityManager,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	ObjectLiteral,
	QueryDeepPartialEntity,
	SaveOptions,
} from "typeorm";
import type { CreatedModel, RemovedModel, UpdatedModel } from "./types.js";

export abstract class IDataBaseService {
	abstract getDefaultConnection(): Promise<DataSource>;
}

export abstract class IRepository<T extends ObjectLiteral> {
	abstract isConnected(): Promise<void>;

	abstract create(
		document: DeepPartial<T>,
		saveOptions?: SaveOptions
	): Promise<CreatedModel>;

	abstract findById(id: string | number): Promise<T | null>;

	abstract findAll(options?: FindManyOptions<T>): Promise<T[]>;

	abstract find(filter: FindManyOptions<T>): Promise<T[]>;

	abstract remove(filter: FindOptionsWhere<T>): Promise<RemovedModel>;

	abstract findOne(filter: FindOneOptions<T>): Promise<T | null>;

	abstract updateOne(
		filter: FindOptionsWhere<T>,
		updated: QueryDeepPartialEntity<T>
	): Promise<UpdatedModel>;

	abstract updateMany(
		filter: FindOptionsWhere<T>,
		updated: QueryDeepPartialEntity<T>
	): Promise<UpdatedModel>;

	abstract withTransaction<R>(
		fn: (manager: EntityManager) => Promise<R>
	): Promise<R>;
}
