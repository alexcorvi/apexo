import { GlobalWithFetchMock } from "jest-fetch-mock";
import * as nock from "nock";
const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require("jest-fetch-mock");
customGlobal.fetchMock = customGlobal.fetch;

window.matchMedia = jest.fn().mockImplementation(query => {
	return {
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn()
	};
});

window.onhashchange = jest.fn().mockImplementation(() => {});

export function mockResponse(
	method: "get" | "post" | "put",
	code: number,
	res: any
) {
	(nock("http://any", {
		filteringScope: () => true
	}).filteringPath(() => "/") as any)
		[method]("/")
		.reply(code, JSON.stringify(res));
}

(global as any).scrollTo = jest.fn();
