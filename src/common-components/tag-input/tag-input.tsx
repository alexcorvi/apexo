import { generateID } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";

export interface TagInputItem {
	key: string;
	text: string;
}

export interface TagInputProps {
	placeholder?: string;
	className?: string;
	onChange?: (currentList: TagInputItem[]) => void;
	onAdd?: (addedItem: TagInputItem) => void;
	onRemove?: (removedItem: TagInputItem) => void;
	options?: TagInputItem[];
	strict?: boolean;
	value?: TagInputItem[];
	formatText?: (text: string) => string;
	sortFunction?: (a: TagInputItem, b: TagInputItem) => any;
	disabled?: boolean;
}

@observer
export class TagInputComponent extends React.Component<TagInputProps, {}> {
	inputElement: HTMLInputElement | undefined;

	@observable searchText: string = "";

	@observable initialList: TagInputItem[] = [];

	@observable keyboardSelectedIndex = -1;

	@observable showAll = false;

	@computed
	get currentList() {
		let list = this.props.value || this.initialList;
		if (this.props.sortFunction) {
			list = list.sort(this.props.sortFunction);
		}
		return list;
	}

	@computed
	get possibleWithoutDuplication() {
		if (!this.props.options) {
			return [];
		}
		let list = this.props.options
			// not on the current list
			.filter(item => !this.currentList.find(x => x.key === item.key))
			// does have a content
			.filter(item => item.text);

		if (this.props.sortFunction) {
			list = list.sort(this.props.sortFunction);
		}
		return list;
	}

	@computed
	get filteredOptions() {
		if (!(this.searchText || this.showAll)) {
			return [];
		} else if (!this.searchText && this.showAll) {
			return this.possibleWithoutDuplication;
		} else {
			return this.possibleWithoutDuplication.filter(
				item =>
					item.text
						.toLowerCase()
						.indexOf(this.searchText.toLowerCase()) > -1
			);
		}
	}

	setSearchText(value: string) {
		this.showAll = false;
		if (value.length === 0) {
			this.keyboardSelectedIndex = -1;
		}
		this.inputElement!.value = value;
		this.searchText = value;
	}

	triggerCallbacks(item: TagInputItem) {
		if (this.props.onChange) {
			this.props.onChange(this.currentList);
		}
		if (this.currentList.find(x => x.key === item.key)) {
			if (this.props.onAdd) {
				this.props.onAdd(item);
			}
		} else {
			if (this.props.onRemove) {
				this.props.onRemove(item);
			}
		}
	}

	addItem(text?: string, key?: string) {
		if (this.searchText || this.showAll) {
			this.currentList.push({
				text: text || this.searchText,
				key: key || generateID(10)
			});
			this.triggerCallbacks(
				this.currentList[this.currentList.length - 1]
			);
			this.setSearchText("");
		}
	}

	verifyAndAdd() {
		if (this.filteredOptions.length && this.keyboardSelectedIndex !== -1) {
			const item = this.filteredOptions[this.keyboardSelectedIndex];
			if (item) {
				this.addItem(item.text, item.key);
			} else if (!this.props.strict) {
				this.addItem();
			}
		} else if (!this.props.strict) {
			this.addItem();
		}
	}

	removeItem(key: string) {
		const i = this.currentList.findIndex(x => x.key === key);
		if (i === -1) {
			return;
		}
		const item = this.currentList.splice(i, 1)[0];
		this.triggerCallbacks(item);
	}

	keyboardEventCallback(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key.length === 1) {
			this.setSearchText(this.inputElement!.value);
		}
		if (event.keyCode === 13) {
			this.verifyAndAdd();
		}
	}

	keyboardNavigation(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.keyCode === 38 && this.keyboardSelectedIndex > 0) {
			// up
			this.keyboardSelectedIndex--;
		} else if (
			event.keyCode === 40 &&
			!(this.keyboardSelectedIndex > this.filteredOptions.length)
		) {
			// down
			this.keyboardSelectedIndex++;
		}
	}

	render() {
		return (
			<div
				className={
					"tag-input-component " + (this.props.className || "")
				}
				onClick={() => {
					this.inputElement!.focus();
				}}
				onKeyDown={event => this.keyboardNavigation(event)}
			>
				<input
					className="input"
					style={
						this.currentList.length > 0
							? undefined
							: { borderBottom: "none" }
					}
					placeholder={this.props.placeholder || undefined}
					ref={el => (el ? (this.inputElement = el) : "")}
					onKeyDown={event => this.keyboardEventCallback(event)}
					onKeyUp={event => this.keyboardEventCallback(event)}
					onChange={event => {
						this.setSearchText(this.inputElement!.value);
					}}
					disabled={this.props.disabled}
				/>
				{this.possibleWithoutDuplication.length &&
				!this.props.disabled &&
				!this.searchText.length ? (
					<Icon
						className="show-all"
						iconName={this.showAll ? "ChevronUp" : "ChevronDown"}
						onClick={() => (this.showAll = !this.showAll)}
					/>
				) : (
					""
				)}

				{(this.searchText.length || this.showAll) &&
				this.filteredOptions.length ? (
					<div className="options-menu">
						{this.filteredOptions.length ? (
							<div>
								{this.filteredOptions.map((item, index) => {
									return (
										<div
											key={item.key}
											className={
												"options-item" +
												(this.keyboardSelectedIndex ===
												index
													? " selected"
													: "")
											}
											onClick={() =>
												this.addItem(
													item.text,
													item.key
												)
											}
										>
											{(this.props.formatText ||
												(x => x))(item.text)}
										</div>
									);
								})}
							</div>
						) : this.props.strict ? (
							<p className="p-l-15">Nothing found</p>
						) : (
							""
						)}
					</div>
				) : (
					""
				)}
				{this.currentList.map(item => {
					return (
						<span key={item.key} className="item">
							{(this.props.formatText || (x => x))(item.text)}
							{this.props.disabled ? (
								""
							) : (
								<Icon
									className="delete-tag-input-item"
									iconName="ChromeClose"
									onClick={() => {
										this.removeItem(item.key);
									}}
								/>
							)}
						</span>
					);
				})}
			</div>
		);
	}
}
