// possible genders
export enum Gender { male, female };

// conversion functions
export function genderToString(gender: Gender) {
	if (gender === Gender.male) { return "male"; }
	else { return "female"; }
}
export function stringToGender(string: string) {
	if (string === "male") { return Gender.male; }
	else { return Gender.female; }
}