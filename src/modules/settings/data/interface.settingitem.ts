export interface SettingItemJSON {
	_id: string;
	val: string;
}

export interface Backup {
	server: string;
	username: string;
	password: string;
	frequency: string;
	lastTime: number;
}
