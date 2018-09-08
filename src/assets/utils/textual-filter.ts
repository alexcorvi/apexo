export function textualFilter<T extends { searchableString: string }>(list: T[], text: string) {
	const filters = text.toLowerCase().split(/\W/).filter((x) => x);
	return list.filter((item) => {
		return filters.every((keyword) => item.searchableString.indexOf(keyword) > -1);
	});
}
