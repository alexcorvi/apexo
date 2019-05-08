import { MessagesView } from "./messages";
import { MessageInterface, messages } from "@core";
import { mount } from "enzyme";
import * as React from "react";

const props = {
	messages: [{ id: "a", text: "a" }]
};

const wrapper = mount<typeof props>(<MessagesView {...props} />);

describe("@main-components: messages", () => {
	it("component mounts", () => {
		expect(wrapper.find(".messages-component")).toExist();
	});
	it("messages are listed", () => {
		wrapper.setProps({ messages: [] });
		expect(wrapper.find(".message").length).toBe(0);
		wrapper.setProps({ messages: [{ id: "a", text: "a" }] });
		expect(wrapper.find(".message").length).toBe(1);
	});
	it("correct text is displayed", () => {
		wrapper.setProps({
			messages: [{ id: "a", text: "a" }, { id: "b", text: "b" }]
		});
		expect(wrapper.find(".m-id-a").text()).toBe("a");
		expect(wrapper.find(".m-id-b").text()).toBe("b");
	});
});
