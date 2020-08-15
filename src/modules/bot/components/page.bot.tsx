import { preUniqueString, uniqueString } from "../../../core/db/index";
import { text } from "@core";
import * as core from "@core";
import * as modules from "@modules";
import { firstDayOfTheWeekDayPicker, formatDate, num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	DatePicker,
	MessageBar,
	PrimaryButton,
	IconButton,
	TooltipHost,
} from "office-ui-fabric-react";
import {
	Col,
	DataTableComponent,
	getRandomTagType,
	PanelTabs,
	PanelTop,
	ProfileComponent,
	ProfileSquaredComponent,
	Row,
	SectionComponent,
	TagComponent,
	TagInputComponent,
} from "@common-components";
import {
	MessageBarType,
	Panel,
	PanelType,
	TextField,
	Toggle,
} from "office-ui-fabric-react";

@observer
export class BotPage extends React.Component {
	dt: null | DataTableComponent = null;

	tabs = [
		{
			key: "details",
			icon: "Contact",
			title: text("case details").h,
		},
		{
			key: "lab",
			icon: "TestBeaker",
			title: text("lab details").h,
		},
		{
			key: "delete",
			icon: "trash",
			title: text("delete").h,
			hidden: !this.canEdit,
		},
	];

	@computed
	get canEdit() {
		return core.user.currentUser!.canEditLabwork;
	}

	@computed
	get selectedLabwork() {
		return modules.labworks!.docs.find(
			(x) => x._id === core.router.selectedID
		);
	}

	@observable activeSubPage: "reminders" | "requests" | "announcements" =
		"reminders";

	render() {
		return (
			<div className="lw-pg">
				<div className="inpage-menu">
					<TooltipHost content={text("appointment reminders").c}>
						<IconButton
							className={
								this.activeSubPage === "reminders"
									? "active"
									: ""
							}
							onClick={() => (this.activeSubPage = "reminders")}
							iconProps={{ iconName: "Message" }}
						></IconButton>
					</TooltipHost>
					<TooltipHost content={text("booking requests").c}>
						<IconButton
							className={
								this.activeSubPage === "requests"
									? "active"
									: ""
							}
							onClick={() => (this.activeSubPage = "requests")}
							iconProps={{ iconName: "CalendarReply" }}
						></IconButton>
					</TooltipHost>
					<TooltipHost content={text("announcements").c}>
						<IconButton
							className={
								this.activeSubPage === "announcements"
									? "active"
									: ""
							}
							onClick={() =>
								(this.activeSubPage = "announcements")
							}
							iconProps={{ iconName: "Megaphone" }}
						></IconButton>
					</TooltipHost>
				</div>

				<div className="sub-page">
					{this.activeSubPage === "reminders" ? (
						<RemindersSubPage></RemindersSubPage>
					) : (
						""
					)}
				</div>
			</div>
		);
	}
}

class RemindersSubPage extends React.Component {
	render() {
		return (
			<div>
				<MessageBar
					className="top-bot-info"
					messageBarType={MessageBarType.info}
				>
					{
						text(
							`You can use the Telegram bot to get daily updates and notifications about your appointments.`
						).c
					}
				</MessageBar>
				<MessageBar
					messageBarIconProps={{ iconName: "robot" }}
					messageBarType={MessageBarType.info}
					className="top-bot-steps"
				>
					<b>(1)</b>:{" "}
					<a target="_blank" href="https://t.me/ApexoDrBot?start=taj">
						{text(`click here to open the chatbot`).c}
					</a>
				</MessageBar>
				<MessageBar
					messageBarIconProps={{ iconName: "lock" }}
					messageBarType={MessageBarType.info}
					className="top-bot-steps"
				>
					<b>(2)</b>: {text(`enter`).c}{" "}
					<strong>
						{preUniqueString()
							.replace(/\D/g, "")
							.substr(0, 8)
							.replace(/^(\d{4})/, "$1 ")}
					</strong>{" "}
					{text(`when asked for the secret number`).c}
				</MessageBar>
				<MessageBar
					messageBarType={MessageBarType.info}
					className="top-bot-steps"
				>
					{
						text(
							`more instructions will be provided by the chat bot`
						).c
					}
				</MessageBar>
			</div>
		);
	}
}
