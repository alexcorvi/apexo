import t4mat from 't4mat';
export function relativeFormat(timestamp: number) {
	return isToday(timestamp)
		? 'Today'
		: isTomorrow(timestamp)
			? 'Tomorrow'
			: isYesterday(timestamp) ? 'Yesterday' : t4mat({ time: timestamp, format: '{R}' });
}

export function comparableTime(date: Date) {
	return {
		y: date.getFullYear(),
		m: date.getMonth(),
		d: date.getDate()
	};
}

export function isToday(timestamp: number) {
	return JSON.stringify(comparableTime(new Date(timestamp))) === JSON.stringify(comparableTime(new Date()));
}

export function isYesterday(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(comparableTime(new Date(new Date().getTime() - 86400000)))
	);
}

export function isTomorrow(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(comparableTime(new Date(new Date().getTime() + 86400000)))
	);
}
