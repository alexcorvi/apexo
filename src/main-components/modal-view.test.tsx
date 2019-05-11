import { ModalsView } from "./modal";
import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

const props = {
	activeModals: [],
	onDismiss: jest.fn(() => {})
};
const confirmModal = jest.fn((input: string) => {});

const div = window.document.createElement("div");
window.document.body.appendChild(div);

describe("@main-components: modals", () => {
	const node = render(<ModalsView {...props} />);
	afterAll(cleanup);

	it("when no modals available", () => {
		expect(
			node.container.parentElement!.querySelectorAll(
				".confirmation-modal"
			).length
		).toBe(0);
	});

	it("when modals are available", () => {
		node.rerender(
			<ModalsView
				{...{
					onDismiss: props.onDismiss,
					activeModals: [
						{
							text: "one",
							input: true,
							onConfirm: confirmModal,
							id: "modal-1",
							showConfirmButton: true,
							showCancelButton: true
						},
						{
							text: "two",
							input: false,
							onConfirm: confirmModal,
							id: "modal-2",
							showConfirmButton: false,
							showCancelButton: false
						}
					]
				}}
			/>
		);
		expect(node.queryAllByTestId("confirmation-modal").length).toBe(2);
	});

	it("input & click confirm button", async () => {
		fireEvent.change(node.getByTestId("modal-input"), {
			target: { value: "abcdef" }
		});
		fireEvent.click(node.getByTestId("confirm-modal-btn"));
		expect(confirmModal).toBeCalledWith("abcdef");
	});
});
