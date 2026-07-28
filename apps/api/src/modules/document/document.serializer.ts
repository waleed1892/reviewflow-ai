import type { Document } from "@reviewflow/database";

export const documentSerializer = (document: Document) => {
	return {
		id: document.id,
		title: document.title,
		status: document.status,
		created_at: document.created_at,
		updated_at: document.updated_at,
	};
};
