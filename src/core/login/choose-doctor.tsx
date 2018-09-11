import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { API } from '../';
import { data } from '../../modules';
import { Dropdown, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { Label, LabelType } from '../../assets/components/label/label.component';
import { login, LoginStep } from './data.login';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Profile } from '../../assets/components/profile/profile';
import './login.scss';

@observer
export class ChooseDoctor extends React.Component<{}, {}> {
	@observable newDocName: string = '';
	render() {
		return (
			<div className="login-component">
				<div className="m-b-5">
					{data.doctorsData.doctors.list.map((doctor) => (
						<div
							className="m-t-5 p-5 doctor-choose pointer"
							onClick={() => {
								login.setDoctor(doctor._id);
							}}
							key={doctor._id}
						>
							<Profile
								size={3}
								name={doctor.name}
								secondaryElement={<span>{doctor.sortedDays.join(', ')}</span>}
							/>
						</div>
					))}
				</div>
				<hr />
				<TextField
					value={this.newDocName}
					onChanged={(v) => (this.newDocName = v)}
					label={'Register new doctor'}
				/>
				<PrimaryButton
					onClick={() => {
						const newDoc = new data.doctorsData.Doctor();
						newDoc.name = this.newDocName;
						this.newDocName = '';
						data.doctorsData.doctors.list.push(newDoc);
					}}
				>
					Register
				</PrimaryButton>
			</div>
		);
	}
}
