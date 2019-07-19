import login from "./basic/login";

interface Index {
	[key: string]: {
		[key: string]: () => Promise<true | string>;
	};
}

const index: Index = {
	basic: {
		login
	}
};

export default index;
