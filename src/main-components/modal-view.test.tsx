import { ModalsView } from "./modal";
import { mount } from "enzyme";
import * as React from "react";

const props = {
	activeModals: [],
	onDismiss: jest.fn(() => {})
};

const wrapper = mount(<ModalsView {...props} />);

const confirmModal = jest.fn((input: string) => undefined);

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
