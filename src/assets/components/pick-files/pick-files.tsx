import * as React from "react";
import { API } from "../../../core";

function dataURItoBlob(dataURI: string) {
	const byteString = atob(dataURI.split(",")[1]);

	// separate out the mime component
	const mimeString = dataURI
		.split(",")[0]
		.split(":")[1]
		.split(";")[0];

	// write the bytes of the string to an ArrayBuffer
	const ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	const ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([ab], { type: mimeString });
	return blob;
}

export const fileTypes = {
	image: ["png", "jpg", "jpeg", "gif", "image/png", "image/gif", "image/jpeg"]
};

export class PickAndUpload extends React.Component<
	{
		// select multiple files at once
		allowMultiple?: boolean;
		// an array of mime types and extensions
		accept: string[];
		// callback on valid file pickup
		onFinish: (URI: string[]) => void;
		onStartLoading?: () => void;
		onFinishLoading?: () => void;
		targetDir: string;
	},
	{}
> {
	pickFileEl: HTMLInputElement | undefined;
	render() {
		return (
			<div onClick={() => this.click()}>
				<input
					type="file"
					multiple={this.props.allowMultiple}
					ref={el => (el ? (this.pickFileEl = el) : "")}
					className="hidden"
					accept={this.props.accept.join(",")}
					onChange={() => {
						const fileList = this.pickFileEl!.files;
						const resultArr: string[] = [];
						if (!fileList || !fileList[0]) {
							return;
						}
						if (this.props.onStartLoading) {
							this.props.onStartLoading();
						}
						for (let index = 0; index < fileList.length; index++) {
							const file = fileList.item(index);
							const reader = new FileReader();
							reader.onload = async (event: Event) => {
								const base64DataURI = (event.target as any)
									.result;
								const blob = dataURItoBlob(base64DataURI);
								const filePath = await API.files.save(
									blob,
									base64DataURI.replace(
										/data:[a-z]*\/([a-z]*);.*/,
										"$1"
									),
									this.props.targetDir
								);
								resultArr.push(filePath);
							};
							reader.readAsDataURL(file as any);
						}
						const checkInterval = setInterval(() => {
							if (resultArr.length !== fileList.length) {
								return;
							}

							if (this.props.onFinishLoading) {
								this.props.onFinishLoading();
							}
							this.props.onFinish(resultArr);
							clearInterval(checkInterval);
							this.pickFileEl!.value = "";
						}, 10);
					}}
				/>
				{this.props.children}
			</div>
		);
	}
	click() {
		this.pickFileEl!.click();
	}
}
