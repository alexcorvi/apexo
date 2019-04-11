import { configs } from "./config";

export function log(name: string | boolean, ...args: any[]) {
	if (
		(typeof name === "string" && !configs[name].shouldLog) ||
		name === true
	) {
		return;
	}
	console.log(name, "=>", ...args);
}
