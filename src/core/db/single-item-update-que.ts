
export let singleItemUpdateQue: { id: string; update: () => void }[] = [];

setInterval(function() {
	if (singleItemUpdateQue.length) {
		singleItemUpdateQue.forEach(async (single) => await single.update());
		singleItemUpdateQue = [];
	}
}, 1500);
