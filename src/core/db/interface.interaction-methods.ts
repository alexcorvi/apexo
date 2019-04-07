export interface InteractionMethods<ClassStatic> {
	syncListToDatabase(newList: ClassStatic[]): Promise<void>;
	add(item: ClassStatic): Promise<PouchDB.Core.Response>;
	remove(_id: string): Promise<PouchDB.Core.Response>;
	update(_id: string, item: ClassStatic): Promise<PouchDB.Core.Response>;
}
