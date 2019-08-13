import { Router } from "./router";
import * as React from "react";

describe("@core: router", () => {
	let c = "aa";
	const router = new Router();
	router.register({
		regex: /aa/,
		namespace: "aa",
		component: async () => <span>aa</span>,
		condition: () => c === "aa"
	});
	router.register({
		regex: /bb/,
		namespace: "bb",
		component: async () => <span>bb</span>,
		condition: () => c === "bb"
	});
	router.register({
		regex: /cc/,
		namespace: "cc",
		component: async () => <span>cc</span>,
		condition: () => c === "cc"
	});

	it("'go' method", done => {
		router.go(["one", "two"]);
		expect(location.hash).toBe("#!/one/two");
		setTimeout(() => {
			expect(router.currentLocation).toBe("one/two");
			done();
		}, 300);
	});

	it("'register' method", () => {
		expect(router.directory.length).toBe(3);
	});

	it("no duplicate registers", () => {
		router.register({
			regex: /cc/,
			namespace: "cc",
			component: async () => <span>cc</span>,
			condition: () => c === "cc"
		});
		expect(router.directory.length).toBe(3);
	});

	it("Current loader", done => {
		router.go(["aa"]);
		setTimeout(async () => {
			await router.currentLoader();
			done();
		}, 300);
	});

	it("Current namespace", done => {
		router.go(["aa"]);
		setTimeout(async () => {
			expect(router.currentNamespace).toBe("aa");
			done();
		}, 300);
	});

	it("Current component", done => {
		router.go(["aa"]);
		setTimeout(async () => {
			const res = await router.currentComponent();
			expect(res.props.children).toBe("aa");
			done();
		}, 300);
	});

	it("Conditions are working", done => {
		router.go(["bb"]);
		setTimeout(async () => {
			const res = await router.currentComponent();
			expect(res.props.children).not.toBe("bb");
			done();
		}, 300);

		router.go(["cc"]);
		c = "cc";
		setTimeout(async () => {
			const res = await router.currentComponent();
			expect(res.props.children).toBe("cc");
			done();
		}, 300);
	});
});
