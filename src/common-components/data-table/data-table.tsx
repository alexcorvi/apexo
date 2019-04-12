import "./data-table.scss";
import { text } from "@core";
import { textualFilter } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
	CommandBar,
	DefaultButton,
	ICommandBarItemProps,
	Icon,
	IconButton,
	MessageBar,
	MessageBarType,
	SearchBox
	} from "office-ui-fabric-react";
import * as React from "react";

interface Cell {
	component: string | React.ReactElement<any>;
	dataValue: string | number;
	onClick?: () => void;
	className?: string;
	visibleOnSize?: string;
}

interface Row {
	id: string;
	cells: Cell[];
	searchableString: string;
}

interface Props {
	maxItemsOnLoad: number;
	heads: string[];
	rows: Row[];
	className?: string;
	commands?: ICommandBarItemProps[];
	onDelete?: (id: string) => void;

	hideSearch?: boolean;

	farItems?: ICommandBarItemProps[];
}

@observer
export class DataTableComponent extends React.Component<Props, {}> {
	@computed get sortableValues() {
		return this.props.rows.map(row => {
			return isNaN(Number(row.cells[this.currentColIndex].dataValue))
				? row.cells[this.currentColIndex].dataValue
				: Number(row.cells[this.currentColIndex].dataValue);
		});
	}
	@observable currentColIndex: number = 0;
	@observable sortDirection: number = 1;
	@observable filterString: string = "";

	@observable limit: number = this.props.maxItemsOnLoad;

	@computed
	get filteredRows() {
		return textualFilter(this.props.rows, this.filterString);
	}

	@computed
	get sortedRows() {
		return this.filteredRows
			.map((row, index) => {
				return {
					row,
					index
				};
			})
			.sort((aVal, bVal) => {
				return this.sortDirection === 1
					? this.compare(
							this.sortableValues[aVal.index],
							this.sortableValues[bVal.index]
					  )
					: this.compare(
							this.sortableValues[bVal.index],
							this.sortableValues[aVal.index]
					  );
			})
			.map(x => x.row);
	}

	@computed
	get limitedRows() {
		const limitedRows: Row[] = [];
		for (let index = 0; index < this.limit; index++) {
			const item = this.sortedRows[index];
			if (item) {
				limitedRows.push(item);
			}
		}
		return limitedRows;
	}

	@computed get farItems(): ICommandBarItemProps[] {
		const items: ICommandBarItemProps[] = [];
		if (!this.props.hideSearch) {
			items.push({
				key: "a",
				onRender: () => (
					<SearchBox
						placeholder={text("Search")}
						onChange={(newVal: string) =>
							(this.filterString = newVal)
						}
					/>
				)
			});
		}

		if (this.props.farItems) {
			return items.concat(this.props.farItems);
		}
		return items;
	}

	render() {
		return (
			<div className="data-table">
				<CommandBar
					{...{
						className: "commandBar fixed m-b-15",
						isSearchBoxVisible: !this.props.hideSearch,
						elipisisAriaLabel: text("More options"),
						farItems: this.farItems,
						items: this.props.commands || []
					}}
				/>
				<table
					className={"responsive ms-table " + this.props.className}
				>
					<thead>
						<tr>
							{this.props.heads.map((head, index) => (
								<th
									className={
										"table-head-sort" +
										(this.currentColIndex === index
											? " current"
											: "") +
										(this.currentColIndex === index &&
										this.sortDirection === 1
											? " positive"
											: "") +
										(this.currentColIndex === index &&
										this.sortDirection === -1
											? " negative"
											: "")
									}
									key={index}
									onClick={() => {
										if (this.currentColIndex === index) {
											this.sortDirection =
												this.sortDirection * -1;
										} else {
											this.currentColIndex = index;
											this.sortDirection = 1;
										}
									}}
								>
									{head}
									<span className="sort-indicators">
										<Icon
											className="positive"
											iconName="ChevronUpSmall"
										/>
										<Icon
											className="negative"
											iconName="ChevronDownSmall"
										/>
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{this.limitedRows.map((row, index) => {
							return (
								<tr key={row.id}>
									{row.cells.map((cell, index2) => {
										return (
											<td
												className={
													(cell.onClick
														? "clickable "
														: "") +
													(cell.className
														? cell.className
														: "")
												}
												key={index2}
												data-head={
													this.props.heads[index2] ||
													""
												}
												onClick={cell.onClick}
											>
												{typeof cell.component ===
												"string"
													? cell.component
													: cell.component}
											</td>
										);
									})}
									<td className="delete-td">
										{this.props.onDelete ? (
											<div>
												<IconButton
													className="delete-button"
													iconProps={{
														iconName: "delete"
													}}
													onClick={() => {
														this.props.onDelete!(
															row.id
														);
													}}
												/>
											</div>
										) : (
											""
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{this.limitedRows.length < this.filteredRows.length ? (
					<DefaultButton
						style={{ marginTop: 20 }}
						iconProps={{ iconName: "more" }}
						onClick={() => (this.limit = this.limit + 10)}
						text={text("Load more")}
					/>
				) : (
					""
				)}

				{this.props.rows.length === 0 ? (
					<MessageBar messageBarType={MessageBarType.info}>
						{text(
							"No data in this section yet, you can add new data by clicking the button above"
						)}
					</MessageBar>
				) : this.filteredRows.length === 0 ? (
					<MessageBar messageBarType={MessageBarType.info}>
						{text(
							"Did not find anything that matches your search criteria"
						)}
					</MessageBar>
				) : (
					""
				)}
			</div>
		);
	}

	private compare(a: string | number, b: string | number) {
		return typeof a === "number" && typeof b === "number"
			? a - b
			: a.toString().localeCompare(b.toString());
	}
}
