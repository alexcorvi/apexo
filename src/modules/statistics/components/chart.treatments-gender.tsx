import { BarChartComponent } from "@common-components";
import { text } from "@core";
import {
	Chart,
	Gender,
	Patient,
	statistics,
	Treatment,
	treatments
	} from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get selectedTreatments() {
		const selectedTreatments: {
			treatment: Treatment;
			male: number;
			female: number;
		}[] = [];
		statistics.selectedAppointments.forEach(appointment => {
			if (appointment.treatment) {
				const i = selectedTreatments.findIndex(
					t => t.treatment._id === appointment.treatment!._id
				);
				let male = 0;
				let female = 0;
				if (
					(appointment.patient || new Patient()).gender ===
					Gender.female
				) {
					female++;
				} else {
					male++;
				}

				if (i === -1) {
					// add new
					selectedTreatments.push({
						treatment: appointment.treatment,
						male,
						female
					});
				} else {
					// just increment
					selectedTreatments[i].male =
						selectedTreatments[i].male + male;
					selectedTreatments[i].female =
						selectedTreatments[i].female + female;
				}
			}
		});
		return selectedTreatments;
	}

	render() {
		return (
			<div>
				<BarChartComponent
					{...{
						horizontal: true,
						height: 400,
						notStacked: true,
						data: {
							xLabels: this.selectedTreatments.map(
								x => x.treatment.type
							),
							bars: [
								{
									label: text("Male"),
									data: this.selectedTreatments.map(
										x => x.male
									)
								},
								{
									label: text("Female"),
									data: this.selectedTreatments.map(
										x => x.female * -1
									)
								}
							]
						}
					}}
				/>
			</div>
		);
	}
}

export const treatmentsByGenderChart: Chart = {
	Component,
	name: "Treatments by gender",
	description: "applied treatments by patients gender",
	tags:
		"A breakdown of applied treatments by patients gender throughout the selected date",
	className: "col-xs-12 col-lg-6"
};
