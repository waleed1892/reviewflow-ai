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

	public getDocuments = async (_req: Request, res: Response) => {
		const documents = await this.service.getDocuments();

		sendSuccessResponse(res, documents.map(documentSerializer));
	};

	public getDocument = async (req: Request, res: Response) => {
		const document = await this.service.getDocument(req.params.id as string);

		sendSuccessResponse(res, documentSerializer(document));
	};

	public createDocument = async (req: Request, res: Response) => {
		const body = createDocumentSchema.parse(req.body);

		const document = await this.service.createDocument(body);

		sendSuccessResponse(res, documentSerializer(document), StatusCodes.CREATED);
	};

	public updateDocument = async (req: Request, res: Response) => {
		const body = updateDocumentSchema.parse(req.body);

		const document = await this.service.updateDocument(
			req.params.id as string,
			body,
		);

		sendSuccessResponse(res, documentSerializer(document));
	};

	public deleteDocument = async (req: Request, res: Response) => {
		await this.service.deleteDocument(req.params.id as string);

		sendSuccessResponse(res, { message: "Document deleted successfully" });
	};
}

export const documentController = new DocumentController();
