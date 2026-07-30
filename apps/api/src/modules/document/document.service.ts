import { tenantPrisma } from "@reviewflow/database";
import { cacheService as redisCacheService } from "@reviewflow-ai/redis";
import {
	CacheKeys,
	type CreateDocumentInput,
	type UpdateDocumentInput,
} from "@reviewflow-ai/shared";

export class DocumentService {
	constructor(
		private readonly db = tenantPrisma,
		private readonly cacheService = redisCacheService,
	) {}

	public getDocuments = async (orgId: string) => {
		const key = CacheKeys.documents(orgId);

		return await this.cacheService.getOrSet(
			key,
			async () => {
				return await this.db.document.findMany({
					where: { organization_id: orgId },
					orderBy: { created_at: "desc" },
				});
			},
			300, // 5 min TTL
		);
	};

	public getDocument = async (orgId: string, id: string) => {
		const key = CacheKeys.document(orgId, id);

		return await this.cacheService.getOrSet(
			key,
			async () => {
				return await this.db.document.findUniqueOrThrow({
					where: { id, organization_id: orgId },
				});
			},
			600, // 10 min TTL
		);
	};

	public createDocument = async (data: CreateDocumentInput) => {
		const document = await this.db.document.create({
			data: {
				title: data.title,
				status: "UPLOADED",
				organization_id: data.organization_id,
			},
		});

		// Invalidate organization list cache
		await this.cacheService.delete(CacheKeys.documents(data.organization_id));

		return document;
	};

	public updateDocument = async (
		orgId: string,
		id: string,
		data: UpdateDocumentInput,
	) => {
		await this.getDocument(orgId, id);

		const document = await this.db.document.update({
			where: { id },
			data: {
				...(data.title !== undefined && { title: data.title }),
			},
		});

		// Invalidate item cache and list cache
		await Promise.all([
			this.cacheService.delete(CacheKeys.document(orgId, id)),
			this.cacheService.delete(CacheKeys.documents(orgId)),
		]);

		return document;
	};

	public deleteDocument = async (orgId: string, id: string) => {
		await this.getDocument(orgId, id);

		await this.db.document.delete({
			where: { id },
		});

		// Invalidate item cache and list cache
		await Promise.all([
			this.cacheService.delete(CacheKeys.document(orgId, id)),
			this.cacheService.delete(CacheKeys.documents(orgId)),
		]);
	};
}

export const documentService = new DocumentService();
