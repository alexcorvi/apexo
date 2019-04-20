export function generateID(length: number = 10, constant?: string) {
	if (!constant) {
		const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		const result = Array.from(
			{ length },
			() => possible[Math.floor(Math.random() * possible.length)]
		).join("");
		return result.match(/^\d/) ? "x" + result.substr(1) : result;
	} else {
		return constant;
	}
}
