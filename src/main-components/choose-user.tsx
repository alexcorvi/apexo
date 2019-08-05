import { ProfileComponent } from "@common-components";
import { MessageInterface, messages, ModalInterface, text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { generateID } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ChooseUserComponent extends React.Component {
	@observable newDocName: string = "";

	newDoc() {
		const newDoc = modules.staff!.new();
		newDoc.name = this.newDocName;
		modules.staff!.add(newDoc);
	}

	render() {
		return (
			<div className="login-component">
				{modules.staff!.docs.length === 0 ? (
					<div id="create-user">
						<TextField
							data-testid="new-user-name"
							value={this.newDocName}
							onChange={(ev, v) => (this.newDocName = v!)}
							label={text("Register as new staff member")}
							onKeyDown={ev => {
								if (ev.keyCode === 13) {
									this.newDoc();
								}
							}}
						/>
						<PrimaryButton
							id="create-new-user-btn"
							onClick={() => {
								this.newDoc();
							}}
							text={text("Register")}
						/>
					</div>
				) : (
					<div id="choose-user">
						<h3>{text("Who are you?")}</h3>
						{modules.staff!.docs.map(user => (
							<div
								data-testid="user-chooser"
								className="m-t-5 p-5 user-chooser pointer"
								onClick={() => {
									if (user.pin) {
										core.modals.newModal({
											id: generateID(),
											text: text("Please enter your PIN"),
											onConfirm: providedPin => {
												if (providedPin === user.pin) {
													core.status.setUser(
														user._id
													);
													messages.activeMessages = [];
												} else {
													core.messages.newMessage({
														id: generateID(),
														text: text(
															`Invalid PIN provided`
														)
													});
												}
											},
											input: true,
											showCancelButton: true,
											showConfirmButton: true
										});
									} else {
										core.status.setUser(user._id);
									}
								}}
								key={user._id}
								id={user._id}
							>
								<ProfileComponent size={3} name={user.name} />{" "}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}
