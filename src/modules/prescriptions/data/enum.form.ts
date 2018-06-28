export enum PrescriptionItemForm {
	ampoule,
	capsule,
	tablet,
	pill,
	gel,
	lotion,
	syrup,
	powder,
	mouthWash,
	suspension
}

export const prescriptionItemForms = [
	'ampoule',
	'capsule',
	'tablet',
	'pill',
	'gel',
	'lotion',
	'syrup',
	'powder',
	'mouth wash',
	'suspension'
];

// conversion functions
export function itemFormToString(itemForm: PrescriptionItemForm) {
	return prescriptionItemForms[itemForm.valueOf()];
}

export function stringToItemForm(itemForm: string) {
	if (itemForm === 'ampoule') {
		return PrescriptionItemForm.ampoule;
	} else if (itemForm === 'capsule') {
		return PrescriptionItemForm.capsule;
	} else if (itemForm === 'tablet') {
		return PrescriptionItemForm.tablet;
	} else if (itemForm === 'pill') {
		return PrescriptionItemForm.pill;
	} else if (itemForm === 'gel') {
		return PrescriptionItemForm.gel;
	} else if (itemForm === 'lotion') {
		return PrescriptionItemForm.lotion;
	} else if (itemForm === 'powder') {
		return PrescriptionItemForm.powder;
	} else if (itemForm === 'mouth wash') {
		return PrescriptionItemForm.mouthWash;
	} else if (itemForm === 'suspension') {
		return PrescriptionItemForm.suspension;
	} else {
		return PrescriptionItemForm.syrup;
	}
}
