import './gallery.scss';
import * as React from 'react';
import { PickFile, fileTypes } from '../../../assets/components/pick-files/pick-files';
import { Icon, Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { API } from '../../../core/index';

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
	pickFileInstance: PickFile;
	@observable gallery: string[] = this.props.gallery;
	@observable show: string = '';
	@observable loading: boolean = false;
	render() {
		return (
			<div className="gallery-component">
				<div className="gallery-label"> {this.props.label} </div>
				{this.gallery.map((image) => (
					<div
						onClick={() => (this.show = image)}
						key={image}
						className="image"
						style={{ backgroundImage: `url(${image})` }}
					/>
				))}
				{navigator.onLine ? (
					<div>
						<span
							className="input-image"
							onClick={() => {
								this.loading = true;
								this.pickFileInstance.click();
							}}
						>
							<Icon iconName={this.loading ? 'Sync' : 'Add'} className={this.loading ? 'rotate' : ''} />
							<span>Add Image</span>
						</span>
						<PickFile
							accept={fileTypes.image}
							onPick={(newFiles) => {
								this.loading = false;
								this.gallery.push(...newFiles);
								this.props.onChange(this.gallery);
							}}
							multiple={this.props.single ? false : true}
							ref={(instance) => (instance ? (this.pickFileInstance = instance) : '')}
						/>
					</div>
				) : (
					''
				)}

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
									this.gallery.splice(this.gallery.indexOf(this.show), 1);
									const fileID = this.show.replace('http://storage.googleapis.com/yre/', '');
									this.show = '';
									const deleteRes = await API.login.request<{
										ok: number;
										n: number;
									}>({
										namespace: 'files',
										subPath: 'delete_clinic',
										method: 'post',
										data: { id: fileID }
									});
								}}
								className="delete"
								iconProps={{ iconName: 'trash' }}
							>
								Delete
							</PrimaryButton>
						</div>
					)}
				>
					<img src={this.show} style={{ maxWidth: '100%' }} />
				</Panel>
			</div>
		);
	}
}
