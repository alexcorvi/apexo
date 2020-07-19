import { decode, encode } from "./base64";
import * as sjcl from "sjcl";

export const defaultSecret = location.host
	.split("")
	.map((x) => x.charCodeAt(0))
	.reduce((a, b) => a + b, 0)
	.toString();

export function encrypt(str: string, secret?: string) {
	return encode((sjcl as any).encrypt(secret || defaultSecret, str));
}

export function decrypt(str: string, secret?: string) {
	return sjcl.decrypt(secret || defaultSecret, decode(str));
}
