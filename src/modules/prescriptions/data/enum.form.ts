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
	suspension,
	toothPaste
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
	'mouthwash',
	'suspension',
	'toothpaste'
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
	} else if (itemForm === 'mouthwash') {
		return PrescriptionItemForm.mouthWash;
	} else if (itemForm === 'suspension') {
		return PrescriptionItemForm.suspension;
	} else if (itemForm === 'toothpaste') {
		return PrescriptionItemForm.toothPaste;
	} else {
		return PrescriptionItemForm.syrup;
	}
}
