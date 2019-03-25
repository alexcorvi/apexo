// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license

// tslint:disable:max-line-length

import { IIconOptions, IIconSubset, registerIcons } from "@uifabric/styling";

export function initializeIcons(
	baseUrl: string = "",
	options?: IIconOptions
): void {
	const subset: IIconSubset = {
		style: {
			MozOsxFontSmoothing: "grayscale",
			WebkitFontSmoothing: "antialiased",
			fontStyle: "normal",
			fontWeight: "normal",
			speak: "none"
		},
		fontFace: {
			fontFamily: `"FabricMDL2Icons"`,
			src: `url('${baseUrl}fabric-icons-b6cb9ed7.woff') format('woff')`
		},
		icons: {
			ZoomOut: "\uE71F",
			Save: "\uE74E",
			MapLayers: "\uE81E",
			View: "\uE890",
			ZoomIn: "\uE8A3",
			Diagnostic: "\uE9D9",
			MiniExpandMirrored: "\uEA5A",
			ExploreContent: "\uECCD",
			GridViewSmall: "\uF232",
			DeleteRows: "\uF64F",
			Rotate90Clockwise: "\uF80D",
			Rotate90CounterClockwise: "\uF80E"
		}
	};

	registerIcons(subset, options);
}
