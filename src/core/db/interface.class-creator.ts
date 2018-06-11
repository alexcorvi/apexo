import { IClassStatic } from './interface.class-static';
import { IDocumentJSON } from './interface.document-json';

export interface IClassCreator {
	new (json?: IDocumentJSON): IClassStatic;
}
