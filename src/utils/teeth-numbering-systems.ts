import { num } from "@utils";

const dictionary: { [index: number]: string } = {
	11: "permanent upper right central incisor",
	12: "permanent upper right lateral incisor",
	13: "permanent upper right canine",
	14: "permanent upper right first premolar",
	15: "permanent upper right second premolar",
	16: "permanent upper right first molar",
	17: "permanent upper right second molar",
	18: "permanent upper right third molar",
	21: "permanent upper left central incisor",
	22: "permanent upper left lateral incisor",
	23: "permanent upper left canine",
	24: "permanent upper left first premolar",
	25: "permanent upper left second premolar",
	26: "permanent upper left first molar",
	27: "permanent upper left second molar",
	28: "permanent upper left third molar",
	31: "permanent lower left central incisor",
	32: "permanent lower left lateral incisor",
	33: "permanent lower left canine",
	34: "permanent lower left first premolar",
	35: "permanent lower left second premolar",
	36: "permanent lower left first molar",
	37: "permanent lower left second molar",
	38: "permanent lower left third molar",
	41: "permanent lower right central incisor",
	42: "permanent lower right lateral incisor",
	43: "permanent lower right canine",
	44: "permanent lower right first premolar",
	45: "permanent lower right second premolar",
	46: "permanent lower right first molar",
	47: "permanent lower right second molar",
	48: "permanent lower right third molar",
	51: "deciduous upper right central incisor",
	52: "deciduous upper right lateral incisor",
	53: "deciduous upper right canine",
	54: "deciduous upper right first molar",
	55: "deciduous upper right second molar",
	61: "deciduous upper left central incisor",
	62: "deciduous upper left lateral incisor",
	63: "deciduous upper left canine",
	64: "deciduous upper left first molar",
	65: "deciduous upper left second molar",
	71: "deciduous lower left central incisor",
	72: "deciduous lower left lateral incisor",
	73: "deciduous lower left canine",
	74: "deciduous lower left first molar",
	75: "deciduous lower left second molar",
	81: "deciduous lower right central incisor",
	82: "deciduous lower right lateral incisor",
	83: "deciduous lower right canine",
	84: "deciduous lower right first molar",
	85: "deciduous lower right second molar"
};

export function convert(ISO: number) {
	const WHOString = ISO.toString();
	const quadrant = num(WHOString.charAt(0));
	const toothNumber = num(WHOString.charAt(1));

	let Palmer = "";
	let Universal: number | string = 0;
	const Name = dictionary[ISO];

	// if permanent dentition
	if (quadrant < 5) {
		if (quadrant === 1) {
			Palmer = toothNumber + " ┘";
			Universal = 9 - toothNumber;
		} else if (quadrant === 2) {
			Palmer = "└ " + toothNumber;
			Universal = toothNumber + 8;
		} else if (quadrant === 3) {
			Palmer = "┌ " + toothNumber;
			Universal = 9 - toothNumber + 16;
		} else if (quadrant === 4) {
			Palmer = toothNumber + " ┐";
			Universal = toothNumber + 24;
		}
	}

	// if deciduous dentition
	else {
		if (quadrant === 5) {
			Palmer = num2Letter(toothNumber) + " ┘";
			Universal = num2Letter(6 - toothNumber);
		} else if (quadrant === 6) {
			Palmer = "└ " + num2Letter(toothNumber);
			Universal = num2Letter(toothNumber + 5);
		} else if (quadrant === 7) {
			Palmer = "┌ " + num2Letter(toothNumber);
			Universal = num2Letter(6 - toothNumber + 10);
		} else if (quadrant === 8) {
			Palmer = num2Letter(toothNumber) + " ┐";
			Universal = num2Letter(toothNumber + 15);
		}
	}
	return {
		Palmer,
		Universal,
		Name,
		ISO
	};
}

function num2Letter(number: number): string {
	return String.fromCharCode(64 + number);
}
