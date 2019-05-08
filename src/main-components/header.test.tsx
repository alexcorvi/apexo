import { HeaderView } from "./header";
import { mount } from "enzyme";
import * as React from "react";

const props = {
	expandMenu: jest.fn(() => undefined),
	expandUser: jest.fn(() => undefined),
	resync: jest.fn(async () => true),
	startReSyncing: jest.fn(() => undefined),
	finishReSyncing: jest.fn(() => undefined),
	currentNamespace: "",
	isOnline: true,
	isCurrentlyReSyncing: true
};

const wrapper = mount<typeof props>(
	<HeaderView
		expandMenu={props.expandMenu}
		expandUser={props.expandUser}
		resync={props.resync}
		startReSyncing={props.startReSyncing}
		finishReSyncing={props.finishReSyncing}
		currentNamespace={props.currentNamespace}
		isOnline={props.isOnline}
		isCurrentlyReSyncing={props.isCurrentlyReSyncing}
	/>
);

describe("@main-components: header", () => {
	it("expands menu", () => {
		wrapper.find("#expand-menu i").simulate("click");
		expect(props.expandMenu).toBeCalled();
	});
	it("expands user", () => {
		wrapper.find("#expand-user i").simulate("click");
		expect(props.expandUser).toBeCalled();
	});
	it("expands user", () => {
		wrapper.find("#expand-menu i").simulate("click");
		expect(props.expandMenu).toBeCalled();
	});
	it("namespace changes: one", () => {
		wrapper.setProps({
			currentNamespace: "one"
		});
		expect(wrapper.find(".title").text()).toBe("one");
	});
	it("online/offline switching", () => {
		wrapper.setProps({
			isOnline: true
		});
		expect(wrapper.find("#online")).toExist();
		wrapper.setProps({
			isOnline: false
		});
		expect(wrapper.find("#offline")).toExist();
	});
	it("Clicking to resync", done => {
		wrapper.setProps({
			isOnline: true
		});
		wrapper.find("#online i").simulate("click");
		expect(props.startReSyncing).toBeCalled();
		expect(props.resync).toBeCalled();
		setTimeout(() => {
			expect(props.finishReSyncing).toBeCalled();
			done();
		}, 50);
	});
	it("rotates when resyncing", () => {
		wrapper.setProps({ isCurrentlyReSyncing: true });
		expect(wrapper.find(".rotate")).toExist();
	});
});
