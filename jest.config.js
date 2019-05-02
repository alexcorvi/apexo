module.exports = {
	automock: false,
	setupFiles: ["./src/mocks/browser-mocks.ts"],
	setupFilesAfterEnv: ["./src/mocks/setup-enzyme-tests.ts"],
	testEnvironment: "enzyme",
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
