import { IIconOptions, IIconSubset, registerIcons } from "@uifabric/styling";
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license

// tslint:disable:max-line-length


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
			src: `url('${baseUrl}fabric-icons-d40e9e78.woff') format('woff')`
		},
		icons: {
			GlobalNavButton: "\uE700",
			ChevronDown: "\uE70D",
			ChevronUp: "\uE70E",
			Add: "\uE710",
			Cancel: "\uE711",
			More: "\uE712",
			Settings: "\uE713",
			Mail: "\uE715",
			Phone: "\uE717",
			Zoom: "\uE71E",
			ZoomOut: "\uE71F",
			Search: "\uE721",
			Lock: "\uE72E",
			MiniLink: "\uE732",
			ReadingMode: "\uE736",
			CheckMark: "\uE73E",
			Print: "\uE749",
			Up: "\uE74A",
			Down: "\uE74B",
			Delete: "\uE74D",
			Save: "\uE74E",
			ContactInfo: "\uE779",
			Contact: "\uE77B",
			Error: "\uE783",
			Calendar: "\uE787",
			PhotoCollection: "\uE7AA",
			Home: "\uE80F",
			MapLayers: "\uE81E",
			View: "\uE890",
			Previous: "\uE892",
			Next: "\uE893",
			Clear: "\uE894",
			Sync: "\uE895",
			Download: "\uE896",
			Upload: "\uE898",
			ZoomIn: "\uE8A3",
			ChromeClose: "\uE8BB",
			CalendarWeek: "\uE8C0",
			Important: "\uE8C9",
			Permissions: "\uE8D7",
			Timer: "\uE91E",
			Info: "\uE946",
			ChevronUpSmall: "\uE96D",
			ChevronDownSmall: "\uE96E",
			Chart: "\uE999",
			Diagnostic: "\uE9D9",
			ErrorBadge: "\uEA39",
			MiniExpandMirrored: "\uEA5A",
			DietPlanNotebook: "\uEAC8",
			Pill: "\uEACB",
			AllCurrency: "\uEAE4",
			Cricket: "\uEB1E",
			WifiWarning4: "\uEB63",
			StatusErrorFull: "\uEB90",
			Photo2: "\uEB9F",
			Photo2Add: "\uECAB",
			Photo2Remove: "\uECAC",
			ExploreContent: "\uECCD",
			ContactCard: "\uEEBD",
			CollapseMenu: "\uEF66",
			GroupedList: "\uEF74",
			EditPhoto: "\uEF77",
			Database: "\uEFC7",
			ZipFolder: "\uF012",
			FabricOpenFolderHorizontal: "\uF0A8",
			BufferTimeBefore: "\uF0CF",
			BufferTimeAfter: "\uF0D0",
			BufferTimeBoth: "\uF0D1",
			StatusCircleErrorX: "\uF13D",
			ExploreContentSingle: "\uF164",
			TripleColumn: "\uF1D5",
			GridViewSmall: "\uF232",
			LocaleLanguage: "\uF2B7",
			MoreVertical: "\uF2BC",
			AlertSolid: "\uF331",
			Teeth: "\uF4A0",
			DeleteRows: "\uF64F",
			ReleaseGateError: "\uF7C0",
			Rotate90Clockwise: "\uF80D",
			Rotate90CounterClockwise: "\uF80E",
			DatabaseSync: "\uF842"
		}
	};

	registerIcons(subset, options);
}
