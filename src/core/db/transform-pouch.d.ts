/// <reference types="pouchdb-core" />
/* tslint:disable:no-single-declare-module */

declare namespace PouchDB {
	interface TransformObject<Doc, Result> {
		incoming: (doc: Doc) => Result;
		outgoing: (result: Result) => Doc;
	}

	type Meta = PouchDB.Core.GetMeta & PouchDB.Core.IdMeta;

	interface Database<Content extends {} = {}> {
		transform<Doc extends Meta, Result extends Partial<Doc> & Meta>(
			transformObject: TransformObject<Doc, Result>
		): void;
	}
}

declare module "transform-pouch" {
	const plugin: PouchDB.Plugin;
	export = plugin;
}
