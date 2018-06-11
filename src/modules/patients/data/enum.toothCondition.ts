// possible conditions of a tooth
export const ToothCondition = {
	sound: 'sound',
	filled: 'filled',
	compromised: 'compromised',
	endo: 'endo',
	missing: 'missing',
	rotated: 'rotated',
	displaced: 'displaced',
	'gum-recessed': 'gum-recessed'
};

export function conditionToColor(c: keyof typeof ToothCondition) {
	if (c === 'compromised') {
		return '#FFCDD2';
	} else if (c === 'endo') {
		return '#D1C4E9';
	} else if (c === 'filled') {
		return '#FFE082';
	} else if (c === 'missing') {
		return '#BDBDBD';
	} else if (c === 'rotated') {
		return '#B2EBF2';
	} else if (c === 'gum-recessed') {
		return '#F48FB1';
	} else if (c === 'displaced') {
		return '#b2dfdb';
	} else {
		return 'transparent';
	}
}
