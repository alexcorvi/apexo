import { grabGPhotos } from "../utils/gphotos";
import { files } from "@core";
import { observable } from "mobx";

class ImagesTable {
	@observable table: { [key: string]: string } = {};

	private gPhotosQue: string[] = [];
	private currentGPhotosWork = "";
	private gPhotosTable: { [key: string]: string[] } = {};

	fetchImage(path: string) {
		if (!this.table[path]) {
			files()
				.get(path)
				.then((imageURI) => (this.table[path] = imageURI));
		}
		return undefined;
	}

	grabGPhotos(link: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			if (this.gPhotosTable[link]) {
				resolve(this.gPhotosTable[link]);
				return;
			}

			this.gPhotosQue.push(link);
			const gPhotosIsGrabbedInterval = setInterval(() => {
				if (this.gPhotosTable[link]) {
					resolve(this.gPhotosTable[link]);
					clearInterval(gPhotosIsGrabbedInterval);
				}
			}, 200);
		});
	}

	constructor() {
		setInterval(() => {
			if (this.gPhotosQue.length === 0) {
				return;
			}
			if (this.currentGPhotosWork.length > 0) {
				return;
			}
			this.currentGPhotosWork = this.gPhotosQue[0];
			grabGPhotos(this.currentGPhotosWork)
				.then((res) => {
					this.gPhotosTable[this.currentGPhotosWork] = res;
				})
				.finally(() => {
					this.currentGPhotosWork = "";
					this.gPhotosQue.splice(0, 1);
				});
		}, 800);
	}
}

export const imagesTable = new ImagesTable();
