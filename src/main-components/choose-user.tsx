import { ProfileComponent } from "@common-components";
import { MessageInterface, ModalInterface, text } from "@core";
import { generateID } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class ChooseUserComponent extends React.Component<
	{
		showMessage: (message: MessageInterface) => void;
		showModal: (modal: ModalInterface) => void;
		onClickUser: (id: string) => void;
		onCreatingNew: (name: string) => void;
		users: { name: string; _id: string; pin: string | undefined }[];
	},
	{}
> {
	@observable newDocName: string = "";
	render() {
		return (
			<div className="login-component">
				{this.props.users.length === 0 ? (
					<div id="create-user">
						<TextField
							id="new-user-name"
							value={this.newDocName}
							onChange={(ev, v) => (this.newDocName = v!)}
							label={text("Register as new staff member")}
						/>
						<PrimaryButton
							id="create-new-user-btn"
							onClick={() => {
								this.props.onCreatingNew(this.newDocName);
							}}
							text={text("Register")}
						/>
					</div>
				) : (
					<div id="choose-user">
						<h3>{text("How are you?")}</h3>
						{this.props.users.map(user => (
							<div
								className="m-t-5 p-5 user-chooser pointer"
								onClick={() => {
									if (user.pin) {
										this.props.showModal({
											id: generateID(),
											text: text("Please enter your PIN"),
											onConfirm: providedPin => {
												if (providedPin === user.pin) {
													this.props.onClickUser(
														user._id
													);
												} else {
													this.props.showMessage({
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
										this.props.onClickUser(user._id);
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
