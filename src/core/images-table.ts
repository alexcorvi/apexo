import { files } from "@core";
import { observable } from "mobx";

class ImagesTable {
	@observable table: { [key: string]: string } = {};

	fetchImage(path: string) {
		if (!this.table[path]) {
			files.get(path).then(imageURI => (this.table[path] = imageURI));
		}
		return undefined;
	}
}

export const imagesTable = new ImagesTable();
