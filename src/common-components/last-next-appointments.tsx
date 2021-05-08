import { ProfileSquaredComponent } from "@common-components";
import { text } from "@core";
import * as core from "@core";
import { Appointment } from "@modules";
import * as modules from "@modules";
import { formatDate } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Icon, PersonaInitialsColor } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class LastNextAppointment extends React.Component<{
	lastAppointment: Appointment | undefined;
	nextAppointment: Appointment | undefined;
	onClick: (id: string) => void;
}> {
	render() {
		return (
			<div className="last-next-appointment">
				<ProfileSquaredComponent
					text={
						this.props.lastAppointment
							? this.props.lastAppointment.treatment
								? this.props.lastAppointment.treatment.type
								: ""
							: ""
					}
					onRenderSecondaryText={() => (
						<i>
							{this.props.lastAppointment
								? `${
										this.props.lastAppointment.isMissed
											? text("missed").c
											: text("previous").c
								  }: ${formatDate(
										this.props.lastAppointment.date,
										modules.setting!.getSetting(
											"date_format"
										)
								  )}`
								: text("no last appointment").c}
						</i>
					)}
					size={3}
					onRenderInitials={() => <Icon iconName="Previous" />}
					onClick={
						this.props.lastAppointment
							? () => {
									if (this.props.lastAppointment) {
										this.props.onClick(
											this.props.lastAppointment._id
										);
									}
							  }
							: undefined
					}
					initialsColor={
						this.props.lastAppointment
							? undefined
							: PersonaInitialsColor.transparent
					}
				/>
				<ProfileSquaredComponent
					text={
						this.props.nextAppointment
							? this.props.nextAppointment.treatment
								? this.props.nextAppointment.treatment.type
								: ""
							: ""
					}
					onRenderSecondaryText={() => (
						<i>
							{this.props.nextAppointment
								? `${text("next").c}: ${formatDate(
										this.props.nextAppointment.date,
										modules.setting!.getSetting(
											"date_format"
										)
								  )}
							`
								: text("no next appointment").c}
						</i>
					)}
					size={3}
					onRenderInitials={() => <Icon iconName="Next" />}
					onClick={
						this.props.nextAppointment
							? () => {
									if (this.props.nextAppointment) {
										this.props.onClick(
											this.props.nextAppointment._id
										);
									}
							  }
							: undefined
					}
					initialsColor={
						this.props.nextAppointment
							? undefined
							: PersonaInitialsColor.transparent
					}
				/>
			</div>
		);
	}
}
