import * as core from "@core";
import { generateID, second } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Icon, Shimmer } from "office-ui-fabric-react";
import * as React from "react";
import * as loadable from "react-loadable";
const CropComponent = loadable({
	loader: async () => (await import("./crop")).CropComponent,
	loading: () => <Shimmer />
});

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
	image: [
		"png",
		"jpg",
		"jpeg",
		"gif",
		"image/png",
		"image/gif",
		"image/jpeg",
		"image/heic"
	]
};

@observer
export class PickAndUploadComponent extends React.Component<
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
		crop?: boolean;
		prevSrc?: string;
		disabled?: boolean;
	},
	{}
> {
	pickFileEl: HTMLInputElement | undefined;

	@observable resultArr: string[] = [];
	@observable toCrop: { [key: string]: string } = {};

	@observable loading: boolean = false;

	@observable filesNumber: number = 0;

	render() {
		return (
			<div onClick={() => this.click()}>
				<input
					type="file"
					multiple={this.props.allowMultiple}
					ref={el => (el ? (this.pickFileEl = el) : "")}
					className="hidden"
					accept={this.props.accept.join(",")}
					onChange={async () => {
						const fileList = this.pickFileEl!.files;
						if (!fileList || !fileList[0]) {
							return;
						}
						this.loading = true;
						if (this.props.onStartLoading) {
							this.props.onStartLoading();
						}
						this.filesNumber = fileList.length;
						for (let index = 0; index < fileList.length; index++) {
							let file = fileList.item(index);
							if (
								file &&
								file.name.toLowerCase().endsWith("heic")
							) {
								const heic2any = (await import("heic2any"))
									.default;
								file = (await heic2any({
									blob: file,
									toType: "image/jpeg"
								})) as any;
							}
							const reader = new FileReader();
							reader.onload = async (event: Event) => {
								const base64DataURI = (event.target as any)
									.result;
								if (this.props.crop) {
									this.toCrop[generateID()] = base64DataURI;
								} else {
									this.saveBase64(base64DataURI);
								}
							};
							reader.readAsDataURL(file as any);
						}
						const checkInterval = setInterval(() => {
							if (this.resultArr.length !== this.filesNumber) {
								return;
							}
							this.pickFileEl!.value = "";
							this.loading = false;
							if (this.props.onFinishLoading) {
								this.props.onFinishLoading();
							}
							this.props.onFinish(this.resultArr.filter(x => x));
							clearInterval(checkInterval);
						}, second / 2);
					}}
				/>
				{this.loading ? (
					<div>
						<Icon iconName="sync" className="rotate" />
						{Object.keys(this.toCrop).map(id => {
							return (
								<CropComponent
									key={id}
									src={this.toCrop[id]}
									prevSrc={this.props.prevSrc || ""}
									onSave={result => {
										this.saveBase64(result);
										delete this.toCrop[id];
									}}
									onDismiss={() => {
										this.filesNumber--;
										delete this.toCrop[id];
									}}
								/>
							);
						})}
					</div>
				) : (
					this.props.children
				)}
			</div>
		);
	}
	click() {
		if (!this.props.disabled) {
			this.pickFileEl!.click();
		}
	}

	async saveBase64(base64DataURI: string) {
		const blob = dataURItoBlob(base64DataURI);
		const filePath = await core.files.save({
			blob: blob,
			ext: base64DataURI.replace(/data:[a-z]*\/([a-z]*);.*/, "$1"),
			dir: this.props.targetDir
		});
		this.resultArr.push(filePath);
	}
}
