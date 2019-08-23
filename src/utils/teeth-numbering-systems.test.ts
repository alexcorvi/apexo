import { convert } from "@utils";
describe("@utils: teeth numbering systems: permanent teeth", () => {
	const P_U_R_6 = 16;
	const P_U_L_6 = 26;
	const P_L_L_6 = 36;
	const P_L_R_6 = 46;

	describe("P_U_R_6", () => {
		const values = convert(P_U_R_6);
		test("Palmer", () => {
			expect(values.Palmer).toBe("6 ┘");
		});
		test("Universal", () => {
			expect(values.Universal).toBe(3);
		});
	});

	describe("P_U_L_6", () => {
		const values = convert(P_U_L_6);
		test("Palmer", () => {
			expect(values.Palmer).toBe("└ 6");
		});
		test("Universal", () => {
			expect(values.Universal).toBe(14);
		});
	});

	describe("P_L_L_6", () => {
		const values = convert(P_L_L_6);
		test("Palmer", () => {
			expect(values.Palmer).toBe("┌ 6");
		});
		test("Universal", () => {
			expect(values.Universal).toBe(19);
		});
	});

	describe("P_L_R_6", () => {
		const values = convert(P_L_R_6);
		test("Palmer", () => {
			expect(values.Palmer).toBe("6 ┐");
		});
		test("Universal", () => {
			expect(values.Universal).toBe(30);
		});
	});
});

describe("@utils: teeth numbering systems: permanent teeth", () => {
	const D_U_R_M = 54;
	const D_U_L_M = 64;
	const D_L_L_M = 74;
	const D_L_R_M = 84;

	describe("D_U_R_M", () => {
		const values = convert(D_U_R_M);
		test("Palmer", () => {
			expect(values.Palmer).toBe("D ┘");
		});
		test("Universal", () => {
			expect(values.Universal).toBe("B");
		});
	});

	describe("D_U_L_M", () => {
		const values = convert(D_U_L_M);
		test("Palmer", () => {
			expect(values.Palmer).toBe("└ D");
		});
		test("Universal", () => {
			expect(values.Universal).toBe("I");
		});
	});

	describe("D_L_L_M", () => {
		const values = convert(D_L_L_M);
		test("Palmer", () => {
			expect(values.Palmer).toBe("┌ D");
		});
		test("Universal", () => {
			expect(values.Universal).toBe("L");
		});
	});

	describe("D_L_R_M", () => {
		const values = convert(D_L_R_M);
		test("Palmer", () => {
			expect(values.Palmer).toBe("D ┐");
		});
		test("Universal", () => {
			expect(values.Universal).toBe("S");
		});
	});
});
