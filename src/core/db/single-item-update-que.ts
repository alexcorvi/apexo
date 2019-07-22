export const singleItemUpdateQue: { [key: string]: () => Promise<any> } = {};

export async function doTheSingleUpdates() {
	const ids = Object.keys(singleItemUpdateQue);
	for (let index = 0; index < ids.length; index++) {
		const id = ids[index];
		await singleItemUpdateQue[id]();
		delete singleItemUpdateQue[id];
	}
}

setInterval(doTheSingleUpdates, 2000);
