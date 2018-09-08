import * as React from 'react';
import { API } from '../../../core';

export const fileTypes = {
	image: [ 'png', 'jpg', 'jpeg', 'gif', 'image/png', 'image/gif', 'image/jpeg' ]
};


export class PickFile extends React.Component<
	{
		// select multiple files at once
		multiple?: boolean;
		// an array of mime types and extensions
		accept: string[];
		// callback on valid file pickup
		onPick: (URI: string[]) => void;
	},
	{}
> {
	pickFileEl: HTMLInputElement | undefined;
	render() {
		return (
			<div>
				<input
					type="file"
					multiple={this.props.multiple}
					ref={(el) => (el ? (this.pickFileEl = el) : '')}
					className="hidden"
					accept={this.props.accept.join(',')}
					onChange={() => {
						if (!this.pickFileEl) {
							return;
						}
						const fileList = this.pickFileEl.files;
						const resultArr: string[] = [];
						if (!fileList || !fileList[0]) {
							return;
						}
						for (let index = 0; index < fileList.length; index++) {
							const file = fileList.item(index);
							const reader = new FileReader();
							reader.onload = async (event: Event) => {
								const imageID = await API.files.save(
									(event.target as any).result.replace(/.*base64,/, '')
								);
								resultArr.push(imageID);
							};
							reader.readAsDataURL(file as any);
						}
						const checkInterval = setInterval(() => {
							if (!this.pickFileEl) {
								return;
							}
							if (resultArr.length !== fileList.length) {
								return;
							}
							this.props.onPick(resultArr);
							clearInterval(checkInterval);
							this.pickFileEl.value = '';
						}, 10);
					}}
				/>
			</div>
		);
	}
	click() {
		if (!this.pickFileEl) {
			return;
		}
		this.pickFileEl.click();
	}
}
