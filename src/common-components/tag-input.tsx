import { observer } from "mobx-react";
import { Label, TagPicker } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class TagInputComponent extends React.Component<
	{
		options: { key: string; text: string }[];
		loose?: boolean;
		label: string;
		suggestionsHeaderText?: string;
		noResultsFoundText?: string;
		maxItems?: number;
		className?: string;
		disabled?: boolean;
		value: { key: string; text: string }[];
		onChange?: (keys: string[]) => void;
	},
	{}
> {
	filterOptions(filter: string) {
		return (
			(this.props.loose && filter.length
				? [{ key: filter, text: filter }].concat(this.props.options)
				: this.props.options
			)
				// apply filter
				.filter(
					option =>
						option.text
							.toLowerCase()
							.indexOf(filter.toLowerCase()) !== -1
				)
				// no repitition
				.filter(
					option =>
						!this.props.value.find(item => item.key === option.key)
				)
				.map(option => ({
					name: option.text,
					key: option.key
				}))
		);
	}

	render() {
		return (
			<div>
				<Label>{this.props.label}</Label>
				<TagPicker
					className={this.props.className}
					onResolveSuggestions={filter => this.filterOptions(filter)}
					pickerSuggestionsProps={{
						suggestionsHeaderText: this.props.suggestionsHeaderText,
						noResultsFoundText: this.props.noResultsFoundText
					}}
					itemLimit={this.props.maxItems}
					disabled={this.props.disabled}
					selectedItems={
						this.props.value
							? this.props.value.map(x => ({
									key: x.key,
									name: x.text
							  }))
							: undefined
					}
					onChange={selected => {
						if (this.props.onChange && selected) {
							this.props.onChange(selected.map(x => x.key));
						}
					}}
				/>
			</div>
		);
	}
}
