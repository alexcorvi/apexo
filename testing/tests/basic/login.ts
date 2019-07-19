import * as utils from "../../utils";

export default async function(): Promise<true | string> {
	return new Promise(resolve =>
		setTimeout(() => {
			resolve(true);
		}, 1000)
	);
}
