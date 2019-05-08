import { ModalsView } from "./modal";
import { mount } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";

const props = {
	activeModals: [],
	onDismiss: jest.fn(() => {})
};

const wrapper = mount(<ModalsView {...props} />);

const confirmModal = jest.fn((input: string) => undefined);

const r = renderer.create(
	<ModalsView
		{...{
			onDismiss: jest.fn(() => {}),
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

describe("@main-components: modals", () => {
	it("when no modals available", () => {
		expect(wrapper.find(".confirmation-modal").length).toBe(0);
	});
	it("when modals are available", () => {
		wrapper.setProps({
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
		});
		expect(wrapper.find(".confirmation-modal").length).toBe(2 * 2);
	});
});
