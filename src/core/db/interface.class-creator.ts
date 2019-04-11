import { IClassStatic, IDocumentJSON } from "@core";
export type IClassCreator = new (json?: IDocumentJSON) => IClassStatic;
