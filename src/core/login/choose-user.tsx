import * as React from "react";
import * as ReactDOM from "react-dom";
import { data } from "../../modules";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import { login } from "./data.login";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Profile } from "../../assets/components/profile/profile";
import "./login.scss";
import { lang } from "../i18/i18";

@observer
export class ChooseUser extends React.Component<{}, {}> {
	@observable newDocName: string = "";
	render() {
		return (
			<div className="login-component">
				<div className="m-b-5">
					{data.staffData.staffMembers.list.map(user => (
						<div
							className="m-t-5 p-5 user-chooser pointer"
							onClick={() => {
								if (user.pin) {
									const providedPin = prompt(
										lang("Please enter your PIN")
									);
									if (providedPin !== user.pin) {
										alert(lang("Incorrect PIN provided"));
										return;
									}
								}
								login.setUser(user._id);
							}}
							key={user._id}
						>
							<Profile
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
				{data.staffData.staffMembers.list.length === 0 ? (
					<div>
						<TextField
							value={this.newDocName}
							onChanged={v => (this.newDocName = v)}
							label={"Register as new staff member"}
						/>
						<PrimaryButton
							onClick={() => {
								const newDoc = new data.staffData.StaffMember();
								newDoc.name = this.newDocName;
								this.newDocName = "";
								data.staffData.staffMembers.list.push(newDoc);
								login.setUser(newDoc._id);
							}}
						>
							Register
						</PrimaryButton>
					</div>
				) : (
					""
				)}
			</div>
		);
	}
}
