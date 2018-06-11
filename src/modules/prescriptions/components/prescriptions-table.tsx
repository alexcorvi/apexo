import './prescription-table.scss';

import * as React from 'react';
import * as data from '../data';

import { CommandBar, Dropdown, Icon, TextField } from 'office-ui-fabric-react';
import { Label, LabelType } from '../../../assets/components/label/label.component';

import { DataTable } from '../../../assets/components/data-table/data-table.component';
import { commands } from './prescriptions-table.commands';
import { observer } from 'mobx-react';

enum ValType {
	number,
	string
}

@observer
export class ItemInput extends React.Component<
	{
		item: data.PrescriptionItem;
		valueKey: string;
		type: ValType;
		disabled?: boolean;
	},
	{}
> {
	render() {
		let view = this.props.item[this.props.valueKey];
		if (typeof view === 'number') {
			view = view.toString();
		}
		return (
			<TextField
				disabled={this.props.disabled}
				type={this.props.type === ValType.number ? 'number' : 'text'}
				value={typeof view !== 'function' ? view : ''}
				onChanged={(newValue: string) => {
					const index = data.prescriptions.getIndexByID(this.props.item._id);
					let casted: any = newValue;
					if (this.props.item.type === ValType.number) {
						casted = Number(newValue);
					} else {
						casted = newValue.toString();
					}
					data.prescriptions.list[index][this.props.valueKey] = casted;
				}}
			/>
		);
	}
}

@observer
export class PrescriptionsTable extends React.Component<{}, {}> {
	dataTable: DataTable;
	componentDidMount() {
		const searchBox = document.querySelectorAll('.prescriptions-component .ms-CommandBarSearch-input');
		if (searchBox.length) {
			const inputBox = searchBox.item(0) as HTMLInputElement;
			inputBox.onkeydown = inputBox.onkeyup = () => {
				data.prescriptions.filter = inputBox.value;
			};
		}
		// by default data table here should not be sorted
		this.dataTable.currentColIndex = 4;
	}

	render() {
		return (
			<div className="prescriptions-component p-15 p-l-10 p-r-10">
				<CommandBar
					{...{
						className: 'commandBar fixed m-b-15',
						isSearchBoxVisible: true,
						searchPlaceholderText: 'Search Prescriptions...',
						elipisisAriaLabel: 'More options',
						items: [],
						farItems: commands
					}}
				/>
				<DataTable
					ref={(c) => (c ? (this.dataTable = c) : '')}
					className={'prescriptions-data-table'}
					heads={[ 'Item Name', 'Dose in mg.', 'Form', 'Times Per Day', '' ]}
					rows={data.prescriptions.filtered.map((item) => [
						{
							sortableValue: item.name,
							component: <ItemInput item={item} valueKey={'name'} type={ValType.string} />
						},
						{
							sortableValue: item.doseInMg,
							component: <ItemInput item={item} valueKey={'doseInMg'} type={ValType.number} />
						},
						{
							sortableValue: item.form,
							component: (
								<Dropdown
									className="form-picker"
									selectedKey={data.itemFormToString(item.form)}
									options={data.prescriptionItemForms.map((form) => {
										return {
											key: form,
											text: form
										};
									})}
									onChanged={(newValue) => {
										data.prescriptions.list[
											data.prescriptions.getIndexByID(item._id)
										].form = data.stringToItemForm(newValue.text);
									}}
								/>
							)
						},
						{
							sortableValue: item.timesPerDay,
							component: <ItemInput item={item} valueKey={'timesPerDay'} type={ValType.number} />
						},
						{
							sortableValue: 0,
							component: (
								<Icon
									iconName={'trash'}
									className="delete-item"
									onMouseEnter={(event) =>
										((event.target as any).parentNode.parentNode.className = 'to-be-deleted')}
									onMouseLeave={(event) =>
										((event.target as any).parentNode.parentNode.className = '')}
									onClick={() => data.prescriptions.deleteByID(item._id)}
								/>
							),
							className: 'no-label'
						}
					])}
				/>
			</div>
		);
	}
}
