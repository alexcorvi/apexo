import tests from "./tests";

interface Results {
	[key: string]: {
		[key: string]: boolean | string;
	};
}

const results: Results = {};

async function run() {
	const testFunctions: Array<() => Promise<any>> = [];

	Object.keys(tests).forEach(async groupName => {
		results[groupName] = {};
		Object.keys(tests[groupName]).forEach(async testName => {
			testFunctions.push(async () => {
				const result = await tests[groupName][testName]();
				results[groupName][testName] =
					result === true ? "✅" : "❌ " + result;
				console.log(
					`🧪🧪🧪 ${groupName} ${testName}: ${
						result === true ? "✅" : "❌ " + result
					}`
				);
			});
		});
	});

	await Promise.all(testFunctions.map(x => x()));

	console.log(results);
}

run();
