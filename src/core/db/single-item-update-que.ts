export const singleItemUpdateQue: { [key: string]: () => Promise<any> } = {};

setInterval(function() {
	Object.keys(singleItemUpdateQue).forEach(async id => {
		await singleItemUpdateQue[id]();
		delete singleItemUpdateQue[id];
	});
}, 1500);
