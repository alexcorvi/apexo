import { observer } from "mobx-react";
import * as React from "react";
@observer
export class GridTableComponent extends React.Component {
	interval: number = 0;

	componentWillMount() {
		this.interval = setInterval(() => {
			document.querySelectorAll(".grid-table").forEach(el => {
				const parentHeight = el.parentElement!.offsetHeight;
				(el as any).style.height = `${parentHeight}px`;
			});
		}, 300) as any;
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<table className="grid-table">
				<tbody>
					{["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(
						rowNum => (
							<tr key={rowNum}>
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(colNum => (
									<td key={colNum + rowNum}>
										{rowNum}
										{colNum}
									</td>
								))}
							</tr>
						)
					)}
				</tbody>
			</table>
		);
	}
}
