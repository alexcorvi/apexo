import { log } from './log';

export let singleItemUpdateQue: { id: string; update: () => void }[] = [];

setInterval(function() {
	if (singleItemUpdateQue.length) {
		log(
			true,
			'Interval check...',
			'Found:',
			singleItemUpdateQue.length,
			'updates in the que, and now will run their update functions'
		);
	}
	singleItemUpdateQue.forEach(async (single) => await single.update());
	singleItemUpdateQue = [];
}, 1500);
