import { tenantPrisma } from "@reviewflow/database";
import type {
	CreateDocumentInput,
	UpdateDocumentInput,
} from "@reviewflow-ai/shared";
import createHttpError from "http-errors";

export class DocumentService {
	constructor(private readonly db = tenantPrisma) {}

	public getDocuments = async () => {
		const documents = await this.db.document.findMany({
			orderBy: { created_at: "desc" },
		});
		return documents;
	};

	public getDocument = async (id: string) => {
		const document = await this.db.document.findUniqueOrThrow({
			where: { id },
		});

		return document;
	};

	public createDocument = async (data: CreateDocumentInput) => {
		const document = await this.db.document.create({
			data: {
				title: data.title,
				status: "UPLOADED",
				organization_id: data.organization_id,
			},
		});
		return document;
	};

	public updateDocument = async (id: string, data: UpdateDocumentInput) => {
		await this.getDocument(id);

		const document = await this.db.document.update({
			where: { id },
			data: {
				...(data.title !== undefined && { title: data.title }),
			},
		});

		return document;
	};

	public deleteDocument = async (id: string) => {
		await this.getDocument(id);

		await this.db.document.delete({
			where: { id },
		});
	};
}

export const documentService = new DocumentService();
