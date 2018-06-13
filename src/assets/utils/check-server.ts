export function checkServer(url: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const http = new XMLHttpRequest();
		http.open('GET', url, true);
		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				resolve(http.status > 199 && http.status < 300);
			}
		};
		try {
			http.send(null);
		} catch (exception) {
			reject();
		}
	});
}
