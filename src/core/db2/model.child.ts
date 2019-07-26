type ModelCreator<SpecificModel> = new (json?: any) => SpecificModel;

interface ChildModel<SpecificModel> {
	model: ModelCreator<SpecificModel>;
	filter(anyDoc: any): boolean;
}

const childModels: ChildModel<any>[] = [];

export function registerChildModel<SpecificModel>(
	childModel: ChildModel<SpecificModel>
) {
	childModels.push(childModel);
}

export function childFromJSON(childJSON: any) {
	const selected = childModels.find(childModel =>
		childModel.filter(childJSON)
	);
	if (selected) {
		return new selected.model(childJSON);
	}
	return null;
}
