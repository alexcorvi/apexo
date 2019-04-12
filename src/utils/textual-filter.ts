import { escapeRegExp } from "@utils";
export function textualFilter<T extends { searchableString: string }>(
	list: T[],
	text: string
) {
	return list.filter(item => {
		const filters = text
			.split(" ")
			.map(filterString => new RegExp(escapeRegExp(filterString), "gim"));
		if (!text) {
			return true;
		}
		return filters.every(filter =>
			filter.test(item.searchableString.toString())
		);
	});
}
