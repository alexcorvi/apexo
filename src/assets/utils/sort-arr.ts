export function sortArrByProp<T>(arr: T[], prop: keyof T) {
	return arr.sort((a, b) => (a[prop] > b[prop] ? 1 : b[prop] > a[prop] ? -1 : 0));
}
