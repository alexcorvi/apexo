import * as React from 'react';
import { API } from '../../../core/index';
import { fileTypes, PickFile } from '../../../assets/components/pick-files/pick-files';
import {
	Icon,
	MessageBar,
	MessageBarType,
	Panel,
	PanelType,
	PrimaryButton,
	Spinner,
	SpinnerSize
	} from 'office-ui-fabric-react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import './gallery.scss';

@observer
export class Gallery extends React.Component<
	{
		single?: boolean;
		label?: string;
		gallery: string[];
		onChange: (images: string[]) => void;
	},
	{}
> {
	pickFileInstance: PickFile | undefined;
	@observable gallery: string[] = this.props.gallery;
	@observable show: string = '';
	@observable loading: boolean = false;
	@observable galleryResolved: { [key: string]: string } = {};

	render() {
		return (
			<div className="gallery-component">
				{API.login.online ? (
					<div>
						<div className="gallery-label"> {this.props.label} </div>
						{this.gallery.map(
							(image) =>
								this.galleryResolved[image] ? (
									<div
										onClick={() => (this.show = image)}
										key={image}
										className="image"
										style={{ backgroundImage: `url(${this.galleryResolved[image]})` }}
									/>
								) : (
									<div key={image} className="image">
										<Spinner size={SpinnerSize.large} />
									</div>
								)
						)}
						<div>
							<span
								className="input-image"
								onClick={() => {
									if (this.pickFileInstance) {
										this.loading = true;
										this.pickFileInstance.click();
									}
								}}
							>
								<Icon
									iconName={this.loading ? 'Sync' : 'Add'}
									className={this.loading ? 'rotate' : ''}
								/>
								<span>Add Image</span>
							</span>
							<PickFile
								accept={fileTypes.image}
								onPick={(newFiles) => {
									this.loading = false;
									this.gallery.push(...newFiles);
									this.props.onChange(toJS(this.gallery));
								}}
								multiple={this.props.single ? false : true}
								ref={(instance) => (instance ? (this.pickFileInstance = instance) : '')}
							/>
						</div>
						<Panel
							isOpen={!!this.show}
							type={PanelType.smallFluid}
							onDismiss={() => (this.show = '')}
							headerText=""
							isFooterAtBottom={true}
							onRenderFooterContent={() => (
								<div>
									<PrimaryButton
										onClick={async () => {
											this.loading = true;
											this.gallery.splice(this.gallery.indexOf(this.show), 1);
											this.props.onChange(toJS(this.gallery));
											await API.files.remove(this.show);
											this.show = '';
											this.loading = false;
										}}
										className={`delete`}
										iconProps={{ iconName: this.loading ? 'sync' : 'delete' }}
										disabled={this.loading}
									>
										Delete
									</PrimaryButton>
								</div>
							)}
						>
							{this.galleryResolved[this.show] ? (
								<img src={this.galleryResolved[this.show]} className="gallery-view" />
							) : (
								<Spinner size={SpinnerSize.large} />
							)}
						</Panel>
					</div>
				) : (
					<div>
						<br />
						<MessageBar messageBarType={MessageBarType.warning}>
							{"Attachments are not available while you're offline."}
						</MessageBar>
					</div>
				)}
			</div>
		);
	}

	componentDidMount() {
		observe(this.gallery, () => this.resolve(), true);
	}

	resolve() {
		this.gallery
			// missing from the resolved directory
			.filter((x) => this.galleryResolved[x] === undefined)
			.forEach(async (targetID) => {
				const b64 = await API.files.get(targetID);
				this.galleryResolved[targetID] = 'data:image/png;base64,' + b64;
				this.forceUpdate();
			});
	}
}
