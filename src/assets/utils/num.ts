export function num(input: string | number) {
	return typeof input === "number"
		? input
		: isNaN(parseFloat(input))
		? 0
		: parseFloat(input);
}
