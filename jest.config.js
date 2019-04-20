module.exports = {
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	testURL: "http://localhost:5984",
	moduleNameMapper: {
		"@core": "<rootDir>/src/core",
		"@utils": "<rootDir>/src/utils",
		"@main-components": "<rootDir>/src/main-components",
		"@common-components": "<rootDir>/src/common-components",
		"@modules": "<rootDir>/src/modules"
	},
	globals: {
		"ts-jest": {
			tsConfig: "tsconfig.json",
			isolatedModules: true,
			diagnostics: {
				ignoreCodes: ["TS151001"]
			}
		}
	}
};
