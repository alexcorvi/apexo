import * as utils from "../../utils";
import { TestSuite } from "../suite.interface";

export const loginSuit: TestSuite = {
	async abc(): Promise<true | string> {
		await new Promise(resolve => setTimeout(resolve, 5000));
		return true;
	}
};
