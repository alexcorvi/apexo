interface Transformation {
	key: string;
	transformer: (value: any) => any;
}

const transformations: Transformation[] = [];

export function registerTransformation(transformation: Transformation) {
	transformations.push(transformation);
}

export function transform({ key, value }: { key: string; value: any }) {
	const selected = transformations.find(
		transformation => transformation.key === key
	);
	if (selected) {
		return selected.transformer(value);
	}
	return null;
}
