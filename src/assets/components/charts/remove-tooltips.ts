export function removeToolTips() {
	document.querySelectorAll(".xy-tooltip")
		.forEach(x => (x.parentNode as HTMLElement).removeChild(x));
}