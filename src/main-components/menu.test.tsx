import { MenuView } from "./menu";
import { cleanup, fireEvent, render } from "@testing-library/react";
import * as React from "react";

const onClick = jest.fn(() => undefined);
const props = {
	items: [
		{
			name: "a",
			key: "a",
			url: "a",
			icon: "a",
			onClick
		}
	],
	isVisible: false,
	currentName: "abc",
	onDismiss: jest.fn(() => undefined)
};

const div = window.document.createElement("div");
window.document.body.appendChild(div);

describe("@main-components: menu", () => {
	const node = render(<MenuView {...props} />);
	afterAll(cleanup);

	describe("big screens menu", () => {
		it("renders items correctly", () => {
			expect(node.queryAllByTestId("menu-item-bg").length).toBe(1);
			expect(node.getByTestId("menu-item-bg").textContent).toBe("a");
		});

		it("clicking menu item", () => {
			fireEvent.click(node.getByTestId("menu-item-bg"));
			expect(onClick).toBeCalled();
		});
	});

	describe("side menu", () => {
		it("shows and hides correctly", () => {
			expect(node.queryAllByTestId("menu-sd").length).toBe(0);
			const nProps = props;
			nProps.isVisible = true;
			node.rerender(<MenuView {...nProps} />);
			expect(node.queryAllByTestId("menu-sd").length).toBe(1);
		});

		it("renders items correctly", () => {
			expect(node.queryAllByTestId("menu-item-sd").length).toBe(1);
			expect(node.getByTestId("menu-item-sd").textContent).toBe("a");
		});

		it("clicking menu item", () => {
			fireEvent.click(
				node.container.parentElement!.querySelector(".ms-Nav-link")!
			);
			expect(onClick).toBeCalledTimes(2);
		});
	});
});
