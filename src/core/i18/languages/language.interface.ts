export interface Language {
	code: string;
	RTL: boolean;
	terms: { [key: string]: string };
}
