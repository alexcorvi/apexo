export function grabGPhotos(sharingURL: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const fromLocalStorage = localStorage.getItem(sharingURL);
		if (fromLocalStorage) {
			return resolve(JSON.parse(fromLocalStorage));
		}

		const xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				const res = JSON.parse(this.responseText);
				localStorage.setItem(sharingURL, res);
				resolve(res);
			}
		});
		xhr.open("POST", "https://gphotos.alisaleem.workers.dev/");
		xhr.send(sharingURL);
	});
}
