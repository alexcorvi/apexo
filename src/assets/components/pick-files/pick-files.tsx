import * as React from 'react';

export const fileTypes = {
	image: [ 'png', 'jpg', 'jpeg', 'gif', 'image/png', 'image/gif', 'image/jpeg' ]
};

import { API } from '../../../core';

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
	pickFileEl: HTMLInputElement;
	render() {
		return (
			<div>
				<input
					type="file"
					multiple={this.props.multiple}
					ref={(el) => (el ? (this.pickFileEl = el) : '')}
					style={{ display: 'none' }}
					accept={this.props.accept.join(',')}
					onChange={() => {
						const fileList = this.pickFileEl.files;
						const resultArr: string[] = [];
						if (!fileList || !fileList[0]) {
							return;
						}
						for (let index = 0; index < fileList.length; index++) {
							const file = fileList.item(index);
							const reader = new FileReader();
							reader.onload = async (event: Event) => {
								const upload = await API.login.request<{ href: string }>({
									namespace: 'files',
									method: 'post',
									subPath: 'upload',
									data: {
										file: (event.target as any).result
									}
								});
								if (upload) {
									resultArr.push(upload.href);
								}
							};
							reader.readAsDataURL(file);
						}
						const checkInterval = setInterval(() => {
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
		this.pickFileEl.click();
	}
}
