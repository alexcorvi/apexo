import { loginSuit } from "./basic/login.test";

interface Index {
	[key: string]: {
		[key: string]: {
			[key: string]: () => Promise<true | string>;
		};
	};
}

const index: Index = {
	basic: {
		loginSuit
	}
};

export default index;
