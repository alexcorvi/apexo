export interface InteractionMethods<ClassStatic> {
	que: { id: string; action: () => Promise<PouchDB.Core.Response> }[];
	syncListToDatabase(newList: ClassStatic[]): Promise<void>;
	add(item: ClassStatic): void;
	remove(_id: string): void;
	update(_id: string, item: ClassStatic): void;
}
