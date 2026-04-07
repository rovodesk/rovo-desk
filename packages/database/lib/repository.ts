import { ApiException } from "@zero-heads-lab/shared/utils";
import type {
	DeepPartial,
	DeleteResult,
	EntityManager,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	ObjectLiteral,
	QueryDeepPartialEntity,
	SaveOptions,
	Repository as TypeOrmRepository,
	UpdateResult,
} from "typeorm";
import type { IRepository } from "./adapter.js";
import type { CreatedModel, RemovedModel, UpdatedModel } from "./types.js";

export class Repository<T extends ObjectLiteral> implements IRepository<T> {
	private readonly repository: TypeOrmRepository<T>;

	constructor(repository: TypeOrmRepository<T>) {
		this.repository = repository;
	}

	// biome-ignore lint/suspicious/useAwait: no awaited function
	async isConnected(): Promise<void> {
		if (!this.repository.manager.connection.isInitialized) {
			throw new ApiException("Database disconnected", {
				statusCode: 500,
				context: "Database",
				code: "DB_DISCONNECTED",
			});
		}
	}

	async create(
		document: DeepPartial<T>,
		saveOptions?: SaveOptions
	): Promise<CreatedModel> {
		const createdEntity = this.repository.create(document);
		const savedResult = await this.repository.save(createdEntity, saveOptions);

		const id =
			(savedResult as unknown as Record<string, unknown>).id ??
			(savedResult as unknown as Record<string, unknown>).uuid;

		return {
			id: id as string | number,
			created: !!id,
		};
	}

	async find(filter: FindManyOptions<T>): Promise<T[]> {
		return await this.repository.find(filter);
	}

	async findById(id: string | number): Promise<T | null> {
		return await this.repository.findOne({
			where: {
				id,
			} as unknown as FindOptionsWhere<T>,
		});
	}

	async findOne(filter: FindOneOptions<T>): Promise<T | null> {
		return await this.repository.findOne(filter);
	}

	async findAll(options?: FindManyOptions<T>): Promise<T[]> {
		return await this.repository.find(options);
	}

	async remove(filter: FindOptionsWhere<T>): Promise<RemovedModel> {
		const result: DeleteResult = await this.repository.delete(filter);

		return {
			deletedCount: result.affected ?? 0,
			deleted: !!result.affected,
		};
	}

	async updateOne(
		filter: FindOptionsWhere<T>,
		updated: QueryDeepPartialEntity<T>
	): Promise<UpdatedModel> {
		const result: UpdateResult = await this.repository.update(filter, updated);

		return {
			affected: result.affected ?? 0,
			updated: !!result.affected,
		};
	}

	async updateMany(
		filter: FindOptionsWhere<T>,
		updated: QueryDeepPartialEntity<T>
	): Promise<UpdatedModel> {
		const result: UpdateResult = await this.repository.update(filter, updated);

		return {
			affected: result.affected ?? 0,
			updated: !!result.affected,
		};
	}

	async withTransaction<R>(
		fn: (manager: EntityManager) => Promise<R>
	): Promise<R> {
		return await this.repository.manager.transaction(fn);
	}
}
