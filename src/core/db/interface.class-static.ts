import { IDocumentJSON } from "./interface.document-json";

export interface IClassStatic extends IDocumentJSON {
	toJSON: () => PouchDB.Core.PutDocument<IDocumentJSON>;
	fromJSON: (json: IDocumentJSON) => void;
}
