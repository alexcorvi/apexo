/// <reference types="pouchdb-core" />
/* tslint:disable:no-single-declare-module */

declare namespace PouchDB {
	interface Database<Content extends {} = {}> {
		crypto(secret: string): void;
		removeCrypto(): void;
	}
}

declare module "crypto-pouch" {
	const plugin: PouchDB.Plugin;
	export = plugin;
}
