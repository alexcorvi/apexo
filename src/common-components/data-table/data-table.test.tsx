import { DataTableComponent } from "@common-components";
import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

function generateRow(input: string) {
	return {
		id: Math.random().toString(),
		searchableString: input,
		cells: [
			{ component: input, dataValue: input },
			{ component: input, dataValue: input },
			{ component: input, dataValue: input },
			{ component: input, dataValue: input }
		]
	};
}

const xCommand = jest.fn(() => {});
const yCommand = jest.fn(() => {});

const props = {
	maxItemsOnLoad: 5,
	heads: ["A", "B", "C", "D"],
	rows: [
		generateRow("alex"),
		generateRow("gabriel"),
		generateRow("david"),
		generateRow("william")
	],
	className: "some-class-name",
	commands: [
		{
			text: "x-command",
			key: "x-command",
			className: "x-command",
			onClick: xCommand
		}
	],
	onDelete: jest.fn(() => {}),
	hideSearch: false,
	farItems: [
		{
			text: "y-command",
			key: "y-command",
			className: "y-command",
			onClick: yCommand
		}
	]
};

const div = window.document.createElement("div");
window.document.body.appendChild(div);

describe("@common-components: data table", () => {
	const node = render(<DataTableComponent {...props} />);
	afterAll(cleanup);
	it.todo("clicking commands");
	it.todo("clicking far items");
	it.todo("table class name");
	it.todo("heads");
	it.todo("current");
	it.todo("positive");
	it.todo("negative");
});
