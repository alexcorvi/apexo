import { ProfileComponent } from "@common-components";
import { Message, messages, modals, status, text } from "@core";
import { staff, StaffMember } from "@modules";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ChooseUserComponent extends React.Component<{}, {}> {
	@observable newDocName: string = "";
	render() {
		return (
			<div className="login-component">
				<div className="m-b-5">
					{staff.list.map(user => (
						<div
							className="m-t-5 p-5 user-chooser pointer"
							onClick={() => {
								if (user.pin) {
									modals.newModal({
										id: Math.random(),
										message: text("Please enter your PIN"),
										onConfirm: providedPin => {
											if (providedPin === user.pin) {
												status.setUser(user._id);
											} else {
												const msg = new Message(
													text("Invalid PIN provided")
												);
												messages.addMessage(msg);
											}
										},
										input: true,
										showCancelButton: true,
										showConfirmButton: true
									});
								} else {
									status.setUser(user._id);
								}
							}}
							key={user._id}
						>
							<ProfileComponent
								size={3}
								name={user.name}
								secondaryElement={
									<span>{user.sortedDays.join(", ")}</span>
								}
							/>
						</div>
					))}
				</div>
				<hr />
				{staff.list.length === 0 ? (
					<div>
						<TextField
							value={this.newDocName}
							onChange={(ev, v) => (this.newDocName = v!)}
							label={text("Register as new staff member")}
						/>
						<PrimaryButton
							onClick={() => {
								const newDoc = new StaffMember();
								newDoc.name = this.newDocName;
								this.newDocName = "";
								staff.list.push(newDoc);
								status.setUser(newDoc._id);
							}}
							text={text("Register")}
						/>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}
