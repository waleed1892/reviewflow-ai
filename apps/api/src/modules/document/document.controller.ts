import {
	createDocumentSchema,
	updateDocumentSchema,
} from "@reviewflow-ai/shared";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccessResponse } from "@/utils/response";
import { documentSerializer } from "./document.serializer";
import { documentService } from "./document.service";

export class DocumentController {
	constructor(private readonly service = documentService) {}

	public getDocuments = async (req: Request, res: Response) => {
		const orgId = req.organizationId;
		const documents = await this.service.getDocuments(orgId);

		sendSuccessResponse(res, documents.map(documentSerializer));
	};

	public getDocument = async (req: Request, res: Response) => {
		const orgId = req.organizationId;
		const document = await this.service.getDocument(
			orgId,
			req.params.id as string,
		);

		sendSuccessResponse(res, documentSerializer(document));
	};

	public createDocument = async (req: Request, res: Response) => {
		const body = createDocumentSchema.parse(req.body);

		const document = await this.service.createDocument({
			...body,
			organization_id: req.organizationId,
		});

		sendSuccessResponse(res, documentSerializer(document), StatusCodes.CREATED);
	};

	public updateDocument = async (req: Request, res: Response) => {
		const orgId = req.organizationId;
		const body = updateDocumentSchema.parse(req.body);

		const document = await this.service.updateDocument(
			orgId,
			req.params.id as string,
			body,
		);

		sendSuccessResponse(res, documentSerializer(document));
	};

	public deleteDocument = async (req: Request, res: Response) => {
		const orgId = req.organizationId;
		await this.service.deleteDocument(orgId, req.params.id as string);

		sendSuccessResponse(res, { message: "Document deleted successfully" });
	};
}

export const documentController = new DocumentController();
