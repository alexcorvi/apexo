// a useful list of the ISO teeth enumeration
export const ISOTeeth = {
	permanent: [
		18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 38, 37, 36, 35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48
	],
	deciduous: [
		55, 54, 53, 52, 51, 61, 62, 63, 64, 65, 75, 74, 73, 72, 71, 81, 82, 83, 84, 85,
	]
};

export const ISOTeethArr = ISOTeeth.deciduous.concat(ISOTeeth.permanent);