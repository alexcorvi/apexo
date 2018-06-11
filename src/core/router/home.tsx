import * as React from 'react';

import { API } from '../';
import { Icon } from 'office-ui-fabric-react';
import { Row, Col } from 'antd';

export class Home extends React.Component<{}, {}> {
	render() {
		return (
			<div className="home  p-15 p-l-10 p-r-10">
				<Row gutter={12}>
					{API.menu.items.sort((a, b) => a.order - b.order).map((item) => {
						return (
							<Col key={item.name} sm={8}>
								<div className="item" onClick={() => item.onClick()}>
									<Icon className="icon" iconName={item.icon} />
									<h3 className="title">{item.name}</h3>
								</div>
							</Col>
						);
					})}
				</Row>
			</div>
		);
	}
}
