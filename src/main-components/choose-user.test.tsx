import { ChooseUserComponent } from "./choose-user";
import { MessageInterface, ModalInterface } from "@core";
import { mount, shallow } from "enzyme";
import * as React from "react";

const props = {
	showMessage: jest.fn((message: MessageInterface) => undefined),
	showModal: jest.fn((modal: ModalInterface) => undefined),
	onClickUser: jest.fn((id: string) => undefined),
	onCreatingNew: jest.fn((name: string) => undefined),
	users: [
		{ name: "Alex", _id: "alex", pin: "" },
		{ name: "Dina", _id: "dina", pin: "" },
		{ name: "Dan", _id: "dan", pin: "1234" }
	]
};

const propsNoUsers = {
	showMessage: jest.fn((message: MessageInterface) => undefined),
	showModal: jest.fn((modal: ModalInterface) => undefined),
	onClickUser: jest.fn((id: string) => undefined),
	onCreatingNew: jest.fn((name: string) => undefined),
	users: []
};

const wrapper = mount(<ChooseUserComponent {...props} />);
const wrapperNoUsers = mount(<ChooseUserComponent {...propsNoUsers} />);

describe("@common-components: choose user", () => {
	/*
	it("component mounts", () => {
		expect(wrapper.find("#create-user")).not.toExist();
		expect(wrapper.find("#choose-user")).toExist();
	});
	it("users are listed", () => {
		expect(wrapper.find(`#alex`)).toExist();
		expect(wrapper.find(`#dina`)).toExist();
	});
	it("Clicking user works", done => {
		wrapper.find("#alex").simulate("click");
		setTimeout(() => {
			expect(props.onClickUser).toHaveBeenLastCalledWith("alex");
			wrapper.find("#dina").simulate("click");
			setTimeout(() => {
				expect(props.onClickUser).toHaveBeenLastCalledWith("dina");
				expect(props.showModal).not.toBeCalled();
				done();
			}, 200);
		}, 200);
	});
	it("clicking user with PIN", done => {
		wrapper.find("#dan").simulate("click");
		setTimeout(() => {
			expect(props.onClickUser).not.toBeCalledWith("dan");
			expect(props.showModal).toBeCalled();
			const modal = props.showModal.mock.calls[0][0];
			expect(modal.input).toBe(true);
			expect(modal.showCancelButton).toBe(true);
			expect(modal.showConfirmButton).toBe(true);
			done();
		});
	});
	it("empty users list", () => {
		expect(wrapperNoUsers.find("#create-user")).toExist();
		expect(wrapperNoUsers.find("#choose-user")).not.toExist();
	});
	*/

	it("Creating new user", done => {
		wrapperNoUsers
			.find("#new-user-name input")
			.simulate("change", { target: { value: "william" } });

		setTimeout(() => {
			wrapperNoUsers.find("button#create-new-user-btn").simulate("click");
			setTimeout(() => {
				expect(propsNoUsers.onCreatingNew).toBeCalledWith("william");
				done();
			}, 200);
		}, 200);
	});
});
