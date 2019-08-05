import { tagType } from "@common-components";

// patient labels interface
export interface Label {
	type: keyof typeof tagType;
	text: string;
}
