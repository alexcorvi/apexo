import { conditionToColor, Tooth } from "@modules";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class TeethDeciduousChartComponent extends React.Component<
	{
		teeth: Tooth[];
		onClick: (ISONumber: number) => void;
	},
	{}
> {
	render() {
		return (
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 560 640"
				style={{ maxHeight: "350px" }}
			>
				<defs>
					<path
						style={{ cursor: "pointer" }}
						d="M283.67 25.03C277.49 12.12 210.6 22.81 215.36 37.87C223.67 64.15 243.24 89.77 265.55 83.89C285.4 78.66 280.04 36.81 283.67 25.03Z"
						id="iso-51"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M268.14 35.87C256.58 30.99 244.5 32.69 231.56 42.92"
						id="a3GVDWJbDP"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M162.99 78.92C155.44 56.79 208.53 29.4 217.53 48.83C223.45 61.63 222.12 95.6 209.45 102.66C195.11 110.66 168.26 94.34 162.99 78.92Z"
						id="iso-52"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M203.98 57.36C195.15 57.99 187.9 57.2 177.49 70.46"
						id="c1vrzH7GD"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M167.61 91.64C160 85.76 147.33 87.27 138.76 91.64C129.14 96.55 122.74 107.49 119.75 117.87C117.02 127.34 121.8 149.48 131.55 148.03C152.21 144.97 173.61 155.55 179.41 136.89C184.52 120.47 179.94 101.17 167.61 91.64Z"
						id="iso-53"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M154.74 98.87C134.65 102.43 131.01 118.38 129.96 129.93"
						id="b2KyfohhGJ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M160.25 299.21C153.08 319.08 132.59 330.79 109.93 326.07C90.3 321.98 77.77 311.21 73.16 284.63C68.83 259.7 65.64 230.04 110.26 230.03C152.64 230.02 175.8 256.19 160.25 299.21Z"
						id="iso-55"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M140.24 246.95C133.89 249.1 122.94 247.7 121.5 254.77C121.31 255.71 119.77 263.24 119.58 264.19C123.56 267.1 130.76 263.92 136.55 263.41C136.52 263.84 117.33 270.52 117.17 270.59C115.25 271.46 110.5 284.98 114.91 291.31C123.18 296.49 132.35 292.13 140.91 292.27C132.74 293.97 121.04 295.45 120.29 297.59C118.96 304.68 117.73 310.3 116.49 315.83C116.5 309.53 117.82 302.85 113.51 297.78C102.66 295.08 102.28 296.93 96.62 297.37C102.1 295.51 105.39 290.93 107.52 284.91C109.52 276.83 107.69 276.44 106.81 274.14C100.84 271.96 97.65 275.37 93.18 275.71C98.97 273.14 105.77 269.9 110.67 266.04C116.38 261.54 109.25 255.86 104.15 250.75C110.81 249.27 117.83 249.45 122.46 238.74C123.72 246.83 132.52 245.46 140.24 246.95Z"
						id="a882cHHUnK"
					/>
					<text
						id="akcTcyEBf"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(1 0 0 1 57.26261763263433 1.5673836060602813)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M106.01 151.25C106.01 151.25 93.48 151.89 87.76 169.07C85.97 174.45 93.87 183.09 91.29 189.25C86.15 201.51 89.38 219.48 99.74 224.3C106.99 227.67 119.41 226.45 125.39 226.5C141.57 226.65 151.59 219.29 159.5 209.78C169.41 197.85 166.37 177.65 157.41 164.39C146.36 155.88 120.62 153.92 106.01 151.25Z"
						id="iso-54"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M130.51 183.51C133.62 186.21 140.69 182.49 145.71 181.43C144.22 182.4 132.32 190.23 130.83 191.2C125.18 199.54 127.13 206.71 126.18 214.71C122.69 213.71 119.33 217.46 115.99 221.85C116.97 217.17 122.12 210.23 117.72 208.45C116.98 208.75 113.3 210.22 106.68 212.88C113.62 207.23 117.47 204.1 118.24 203.47C118.24 203.47 121.47 196.48 118.96 197.5C116.45 198.53 105.08 195.27 105.08 195.27C105.08 195.27 116.83 196.57 121.65 190.91C126.47 185.25 126.7 181.74 127.47 177.82C128.25 173.9 127.84 169.96 130.05 167.14C131.99 164.64 138.23 163.16 138.23 163.16C134.35 170.11 131.23 176.96 130.51 183.51Z"
						id="cwHRvgNcf"
					/>
					<text
						id="b1QRjJGSJn"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(1 0 0 1 28.026439084936285 179.44872859690972)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<text
						id="aQ4GDm7Nj"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(1 0 0 1 45.182689084936285 195.07372859690972)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<text
						id="c1Am1SRnuf"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 9.499999999999972 -13.818655303030482)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[51].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							51
						</tspan>
					</text>
					<text
						id="a1wTSzo241"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -27.54545454545476 -3.3489583333335986)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[52].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							52
						</tspan>
					</text>
					<text
						id="dngiuIzIj"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -60.114216486779355 29.63351517487976)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[53].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							53
						</tspan>
					</text>
					<text
						id="aPscZuMW"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -71.54390398677936 81.17930349069081)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[54].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							54
						</tspan>
					</text>
					<text
						id="evESRjLHU"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -73.54390398677938 163.84957592658844)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[55].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							55
						</tspan>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M310.94 25.03C317.11 12.12 384.01 22.81 379.24 37.87C370.93 64.15 351.36 89.77 329.06 83.89C309.21 78.66 314.56 36.81 310.94 25.03Z"
						id="iso-61"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M326.46 35.87C338.02 30.99 350.11 32.69 363.05 42.92"
						id="h1eFc4drSD"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M431.61 78.92C439.17 56.79 386.08 29.4 377.08 48.83C371.15 61.63 372.49 95.6 385.15 102.66C399.5 110.66 426.35 94.34 431.61 78.92Z"
						id="iso-62"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M390.63 57.36C399.45 57.99 406.71 57.2 417.12 70.46"
						id="f8TlGPwTJ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M426.99 91.64C434.6 85.76 447.28 87.27 455.84 91.64C465.46 96.55 471.87 107.49 474.86 117.87C477.59 127.34 472.81 149.48 463.06 148.03C442.39 144.97 421 155.55 415.19 136.89C410.09 120.47 414.66 101.17 426.99 91.64Z"
						id="iso-63"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M439.87 98.87C459.96 102.43 463.6 118.38 464.65 129.93"
						id="a4D4emNiDi"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M430.01 299.21C437.19 319.08 457.68 330.79 480.34 326.07C499.97 321.98 512.5 311.21 517.11 284.63C521.44 259.7 524.62 230.04 480.01 230.03C437.63 230.02 414.47 256.19 430.01 299.21Z"
						id="iso-65"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M450.03 246.95C456.38 249.1 467.33 247.7 468.77 254.77C468.96 255.71 470.49 263.24 470.69 264.19C466.71 267.1 459.51 263.92 453.72 263.41C453.75 263.84 472.94 270.52 473.1 270.59C475.02 271.46 479.77 284.98 475.35 291.31C467.09 296.49 457.92 292.13 449.36 292.27C457.53 293.97 469.23 295.45 469.98 297.59C471.3 304.68 472.54 310.3 473.78 315.83C473.77 309.53 472.45 302.85 476.76 297.78C487.61 295.08 487.99 296.93 493.65 297.37C488.17 295.51 484.88 290.93 482.75 284.91C480.75 276.83 482.58 276.44 483.46 274.14C489.43 271.96 492.62 275.37 497.09 275.71C491.3 273.14 484.5 269.9 479.59 266.04C473.89 261.54 481.02 255.86 486.12 250.75C479.46 249.27 472.44 249.45 467.81 238.74C466.55 246.83 457.75 245.46 450.03 246.95Z"
						id="d9AQUN9l"
					/>
					<text
						id="c2wMTLwFKC"
						x="214.21"
						y="10.52"
						fontSize="45"
						transform="matrix(-1 0 0 1 537.3434429734264 1.5673836060602813)"
					>
						<tspan
							x="214.21"
							dy="0em"
							dominantBaseline="text-before-edge"
						/>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M484.26 151.25C484.26 151.25 496.79 151.89 502.51 169.07C504.29 174.45 496.4 183.09 498.98 189.25C504.12 201.51 500.89 219.48 490.53 224.3C483.28 227.67 470.86 226.45 464.88 226.5C448.7 226.65 438.68 219.29 430.77 209.78C420.86 197.85 423.9 177.65 432.86 164.39C443.91 155.88 469.65 153.92 484.26 151.25Z"
						id="iso-64"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M459.76 183.51C456.65 186.21 449.57 182.49 444.56 181.43C446.05 182.4 457.95 190.23 459.44 191.2C465.09 199.54 463.14 206.71 464.08 214.71C467.58 213.71 470.93 217.46 474.28 221.85C473.3 217.17 468.14 210.23 472.55 208.45C473.29 208.75 476.97 210.22 483.59 212.88C476.65 207.23 472.8 204.1 472.03 203.47C472.03 203.47 468.8 196.48 471.31 197.5C473.82 198.53 485.19 195.27 485.19 195.27C485.19 195.27 473.44 196.57 468.62 190.91C463.8 185.25 463.57 181.74 462.8 177.82C462.02 173.9 462.43 169.96 460.22 167.14C458.27 164.64 452.04 163.16 452.04 163.16C455.92 170.11 459.04 176.96 459.76 183.51Z"
						id="g9i5HslOD"
					/>
					<text
						id="a3vLld1187"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 80.0303030303032 -16.8489583333336)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[61].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							61
						</tspan>
					</text>
					<text
						id="d8C077TiQe"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(0.9999643816274039 -0.00844011116774232 0.00844011116774232 0.9999643816274039 118.8765401877632 3.6746787627775532)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[62].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							62
						</tspan>
					</text>
					<text
						id="a3dsbSynl2"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 147.53030303030368 32.74195075757564)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[63].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							63
						</tspan>
					</text>
					<text
						id="c3i2cqy5i8"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 154.65196824741906 71.6076251690125)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[64].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							64
						</tspan>
					</text>
					<text
						id="c2Gq2EB8T"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 154.651968247419 163.84957592658844)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[65].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							65
						</tspan>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M279.53 622.47C276.07 633.75 231.24 627.41 233.67 614.36C237.9 591.57 249.62 568.89 264.68 572.98C278.08 576.62 276.56 612.57 279.53 622.47Z"
						id="iso-81"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M268.73 613.87C261.31 618.51 253.22 617.56 244.15 609.37"
						id="baO5m8gAJ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M176.01 582.48C170.09 605.02 222.03 629.2 229.47 609.27C234.38 596.14 231.19 562.31 218.76 556.01C204.69 548.89 180.13 566.77 176.01 582.48Z"
						id="iso-82"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M216.13 601.56C207.72 601.46 200.88 602.68 190.24 590.06"
						id="b1OuMQtEP6"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M181.67 570C174.78 576.32 162.66 575.57 154.29 571.72C144.88 567.39 138.18 556.85 134.75 546.67C131.63 537.38 134.91 515 144.25 515.86C164.03 517.69 183.74 505.85 190.31 524.14C196.08 540.22 192.84 559.75 181.67 570Z"
						id="iso-83"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M169.04 563.56C149.77 561.2 145.41 545.49 143.76 534.03"
						id="b2roP7vEXi"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M161.75 365.13C153.81 345.73 133.7 335.25 112.46 341.31C94.06 346.56 82.78 358.06 79.91 384.87C77.21 410.02 75.86 439.81 118.21 437.16C158.44 434.65 178.94 407.15 161.75 365.13Z"
						id="iso-85"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M145.71 418.49C139.56 416.72 129.24 418.77 127.48 411.8C127.24 410.87 125.36 403.44 125.13 402.51C128.74 399.37 135.75 402.12 141.27 402.27C141.22 401.85 122.63 396.32 122.47 396.26C120.6 395.51 115.33 382.29 119.16 375.71C126.71 370.05 135.66 373.86 143.78 373.21C135.93 372 124.74 371.22 123.91 369.13C122.25 362.13 120.75 356.59 119.27 351.14C119.63 357.43 121.27 364.02 117.46 369.34C107.31 372.69 106.85 370.86 101.45 370.76C106.76 372.29 110.14 376.66 112.5 382.54C114.86 390.49 113.14 390.99 112.44 393.33C106.89 395.87 103.67 392.66 99.41 392.58C105.06 394.8 111.69 397.63 116.57 401.2C122.24 405.34 115.79 411.44 111.24 416.84C117.64 417.92 124.3 417.32 129.3 427.74C130.03 419.59 138.46 420.44 145.71 418.49Z"
						id="avxQ9BjFX"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M118.64 516.06C118.64 516.06 106.71 516.17 100.31 499.36C98.31 494.09 105.31 485 102.51 479C96.94 467.07 98.99 448.94 108.55 443.51C115.24 439.71 127.1 440.19 132.77 439.78C148.12 438.68 158.04 445.42 166.09 454.45C176.18 465.76 174.44 486.11 166.69 499.88C156.67 509.03 132.35 512.52 118.64 516.06Z"
						id="iso-84"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M140.06 482.4C142.87 479.52 149.79 482.81 154.61 483.57C153.14 482.68 141.41 475.58 139.94 474.7C134.1 466.71 135.54 459.43 134.19 451.51C130.94 452.71 127.54 449.17 124.12 444.99C125.31 449.6 130.59 456.22 126.51 458.26C125.8 458.01 122.22 456.75 115.78 454.49C122.69 459.72 126.53 462.62 127.29 463.2C127.29 463.2 130.76 469.99 128.31 469.11C125.87 468.24 115.26 472.17 115.26 472.17C115.26 472.17 126.35 470.17 131.24 475.53C136.13 480.9 136.55 484.39 137.51 488.26C138.46 492.12 138.3 496.08 140.56 498.77C142.54 501.14 148.55 502.25 148.55 502.25C144.47 495.55 141.12 488.89 140.06 482.4Z"
						id="a5EcJWHaOD"
					/>
					<text
						id="a1jKNA7rAN"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 9.128496503496507 445.10453088578424)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[81].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							81
						</tspan>
					</text>
					<text
						id="aAHeijBe5"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -25.137128496503493 430.50453088578445)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[82].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							82
						</tspan>
					</text>
					<text
						id="ek5cw6Hgp"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -53.026333041958225 396.11494755245076)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[83].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							83
						</tspan>
					</text>
					<text
						id="g2rNJx6rxS"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -66.3451977036963 352.9505417835022)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[84].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							84
						</tspan>
					</text>
					<text
						id="d14UMdDj6N"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 -71.62851406792367 265.32019716321423)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[85].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							85
						</tspan>
					</text>
					<path
						style={{ cursor: "pointer" }}
						d="M309.33 622.47C312.79 633.75 357.62 627.41 355.2 614.36C350.96 591.57 339.24 568.89 324.18 572.98C310.78 576.62 312.3 612.57 309.33 622.47Z"
						id="iso-71"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M320.14 613.87C327.56 618.51 335.65 617.56 344.71 609.37"
						id="f1SexwZEcq"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M412.85 582.48C418.77 605.02 366.83 629.2 359.39 609.27C354.49 596.14 357.68 562.31 370.1 556.01C384.17 548.89 408.73 566.77 412.85 582.48Z"
						id="iso-72"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M372.73 601.56C381.14 601.46 387.98 602.68 398.62 590.06"
						id="b9tcVaTZ"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M407.19 570C414.08 576.32 426.2 575.57 434.58 571.72C443.98 567.39 450.69 556.85 454.11 546.67C457.23 537.38 453.95 515 444.62 515.86C424.83 517.69 405.12 505.85 398.55 524.14C392.78 540.22 396.03 559.75 407.19 570Z"
						id="iso-73"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M419.82 563.56C439.09 561.2 443.45 545.49 445.1 534.03"
						id="hdg0tmh2L"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M427.56 365.13C435.5 345.73 455.61 335.25 476.85 341.31C495.25 346.56 506.53 358.06 509.4 384.87C512.1 410.02 513.45 439.81 471.1 437.16C430.87 434.65 410.37 407.15 427.56 365.13Z"
						id="iso-75"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M443.6 418.49C449.75 416.72 460.06 418.77 461.83 411.8C462.06 410.87 463.95 403.44 464.18 402.51C460.57 399.37 453.56 402.12 448.04 402.27C448.09 401.85 466.68 396.32 466.84 396.26C468.7 395.51 473.98 382.29 470.15 375.71C462.6 370.05 453.65 373.86 445.53 373.21C453.38 372 464.57 371.22 465.4 369.13C467.06 362.13 468.56 356.59 470.04 351.14C469.68 357.43 468.04 364.02 471.85 369.34C481.99 372.69 482.46 370.86 487.86 370.76C482.55 372.29 479.17 376.66 476.81 382.54C474.45 390.49 476.17 390.99 476.87 393.33C482.41 395.87 485.64 392.66 489.9 392.58C484.25 394.8 477.62 397.63 472.74 401.2C467.07 405.34 473.52 411.44 478.07 416.84C471.67 417.92 465.01 417.32 460.01 427.74C459.28 419.59 450.84 420.44 443.6 418.49Z"
						id="h46WoT2rhW"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M470.67 516.06C470.67 516.06 482.6 516.17 489 499.36C491 494.09 483.99 485 486.8 479C492.37 467.07 490.32 448.94 480.76 443.51C474.06 439.71 462.21 440.19 456.53 439.78C441.19 438.68 431.26 445.42 423.22 454.45C413.13 465.76 414.87 486.11 422.62 499.88C432.64 509.03 456.96 512.52 470.67 516.06Z"
						id="iso-74"
					/>
					<path
						style={{ cursor: "pointer" }}
						d="M449.24 482.4C446.44 479.52 439.52 482.81 434.7 483.57C436.17 482.68 447.9 475.58 449.37 474.7C455.21 466.71 453.76 459.43 455.11 451.51C458.37 452.71 461.77 449.17 465.19 444.99C464 449.6 458.71 456.22 462.8 458.26C463.51 458.01 467.09 456.75 473.53 454.49C466.62 459.72 462.78 462.62 462.02 463.2C462.02 463.2 458.55 469.99 461 469.11C463.44 468.24 474.05 472.17 474.05 472.17C474.05 472.17 462.96 470.17 458.07 475.53C453.18 480.9 452.76 484.39 451.8 488.26C450.84 492.12 451.01 496.08 448.75 498.77C446.76 501.14 440.76 502.25 440.76 502.25C444.84 495.55 448.19 488.89 449.24 482.4Z"
						id="a4VwzCcbws"
					/>
					<text
						id="a253G7JNHZ"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 72.42849650349658 445.10453088578436)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[71].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							71
						</tspan>
					</text>
					<text
						id="dgSWNXQt1"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 135.69999271561827 396.11494755245076)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[73].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							73
						</tspan>
					</text>
					<text
						id="b1fKZ8Bv2u"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 110.36287150349685 430.50453088578445)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[72].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							72
						</tspan>
					</text>
					<text
						id="b83Atca9Z"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 147.12968021561827 350.3920846156701)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[74].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							74
						</tspan>
					</text>
					<text
						id="hfHo0NDB3"
						x="241.89"
						y="100.29"
						fontSize="20"
						transform="matrix(1 0 0 1 154.3272936186599 258.43678158536613)"
					>
						<tspan
							x="241.89"
							dy="0em"
							dominantBaseline="text-before-edge"
							{...(this.props.teeth[75].notes.length
								? { stroke: "#212121" }
								: {})}
						>
							75
						</tspan>
					</text>
				</defs>
				<g className="main">
					<g className="q5">
						<g className="1" onClick={() => this.props.onClick(51)}>
							<g>
								<use
									xlinkHref="#iso-51"
									fill={conditionToColor(
										this.props.teeth[51].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-51"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a3GVDWJbDP"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#a3GVDWJbDP"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(52)}>
							<g>
								<use
									xlinkHref="#iso-52"
									fill={conditionToColor(
										this.props.teeth[52].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-52"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#c1vrzH7GD"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#c1vrzH7GD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(53)}>
							<g>
								<use
									xlinkHref="#iso-53"
									fill={conditionToColor(
										this.props.teeth[53].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-53"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b2KyfohhGJ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b2KyfohhGJ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(54)}>
							<g>
								<use
									xlinkHref="#iso-54"
									fill={conditionToColor(
										this.props.teeth[54].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-54"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#cwHRvgNcf"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#cwHRvgNcf"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(55)}>
							<g>
								<use
									xlinkHref="#iso-55"
									fill={conditionToColor(
										this.props.teeth[55].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-55"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a882cHHUnK"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#a882cHHUnK"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="ch2ZdTfb">
								<use
									xlinkHref="#c1Am1SRnuf"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="aVfNqKx3C">
								<use
									xlinkHref="#a1wTSzo241"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="c14SVdlY4">
								<use
									xlinkHref="#dngiuIzIj"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="b17vJJzkit">
								<use
									xlinkHref="#aPscZuMW"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="bUzQYBN8P">
								<use
									xlinkHref="#evESRjLHU"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
					<g className="g6">
						<g className="1" onClick={() => this.props.onClick(61)}>
							<g>
								<use
									xlinkHref="#iso-61"
									fill={conditionToColor(
										this.props.teeth[61].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-61"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#h1eFc4drSD"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#h1eFc4drSD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(62)}>
							<g>
								<use
									xlinkHref="#iso-62"
									fill={conditionToColor(
										this.props.teeth[62].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-62"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#f8TlGPwTJ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#f8TlGPwTJ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(63)}>
							<g>
								<use
									xlinkHref="#iso-63"
									fill={conditionToColor(
										this.props.teeth[63].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-63"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a4D4emNiDi"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#a4D4emNiDi"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(64)}>
							<g>
								<use
									xlinkHref="#iso-64"
									fill={conditionToColor(
										this.props.teeth[64].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-64"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#g9i5HslOD"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#g9i5HslOD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(65)}>
							<g>
								<use
									xlinkHref="#iso-65"
									fill={conditionToColor(
										this.props.teeth[65].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-65"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#d9AQUN9l"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#d9AQUN9l"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="d2U4NC4l2h">
								<use
									xlinkHref="#a3vLld1187"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="chkNbUqVc">
								<use
									xlinkHref="#d8C077TiQe"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="e29QMOL8fU">
								<use
									xlinkHref="#a3dsbSynl2"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a2UkPZ9kt7">
								<use
									xlinkHref="#c3i2cqy5i8"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="b1ItOC0t1y">
								<use
									xlinkHref="#c2Gq2EB8T"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
					<g className="q7">
						<g className="1" onClick={() => this.props.onClick(71)}>
							<g>
								<use
									xlinkHref="#iso-71"
									fill={conditionToColor(
										this.props.teeth[71].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-71"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#f1SexwZEcq"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#f1SexwZEcq"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(72)}>
							<g>
								<use
									xlinkHref="#iso-72"
									fill={conditionToColor(
										this.props.teeth[72].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-72"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b9tcVaTZ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b9tcVaTZ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(73)}>
							<g>
								<use
									xlinkHref="#iso-73"
									fill={conditionToColor(
										this.props.teeth[73].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-73"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#hdg0tmh2L"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#hdg0tmh2L"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(74)}>
							<g>
								<use
									xlinkHref="#iso-74"
									fill={conditionToColor(
										this.props.teeth[74].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-74"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a4VwzCcbws"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#a4VwzCcbws"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(75)}>
							<g>
								<use
									xlinkHref="#iso-75"
									fill={conditionToColor(
										this.props.teeth[75].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-75"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#h46WoT2rhW"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#h46WoT2rhW"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="bbGVcBKeK">
								<use
									xlinkHref="#a253G7JNHZ"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a2LizwfKkt">
								<use
									xlinkHref="#dgSWNXQt1"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a1dli2uYZu">
								<use
									xlinkHref="#b1fKZ8Bv2u"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="aCcMzwUXK">
								<use
									xlinkHref="#b83Atca9Z"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="b1Rz4H5VcT">
								<use
									xlinkHref="#hfHo0NDB3"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
					<g className="q8">
						<g className="1" onClick={() => this.props.onClick(81)}>
							<g>
								<use
									xlinkHref="#iso-81"
									fill={conditionToColor(
										this.props.teeth[81].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-81"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#baO5m8gAJ"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#baO5m8gAJ"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="2" onClick={() => this.props.onClick(82)}>
							<g>
								<use
									xlinkHref="#iso-82"
									fill={conditionToColor(
										this.props.teeth[82].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-82"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b1OuMQtEP6"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b1OuMQtEP6"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="3" onClick={() => this.props.onClick(83)}>
							<g>
								<use
									xlinkHref="#iso-83"
									fill={conditionToColor(
										this.props.teeth[83].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-83"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#b2roP7vEXi"
									opacity="1"
									fillOpacity="0"
								/>
								<g>
									<use
										xlinkHref="#b2roP7vEXi"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
						</g>
						<g className="4" onClick={() => this.props.onClick(84)}>
							<g>
								<use
									xlinkHref="#iso-84"
									fill={conditionToColor(
										this.props.teeth[84].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-84"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#a5EcJWHaOD"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#a5EcJWHaOD"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="5" onClick={() => this.props.onClick(85)}>
							<g>
								<use
									xlinkHref="#iso-85"
									fill={conditionToColor(
										this.props.teeth[85].condition
									)}
								/>
								<g>
									<use
										xlinkHref="#iso-85"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="2"
									/>
								</g>
							</g>
							<g>
								<use
									xlinkHref="#avxQ9BjFX"
									opacity="1"
									fill="#000"
								/>
								<g>
									<use
										xlinkHref="#avxQ9BjFX"
										fillOpacity="0"
										stroke="#000"
										strokeWidth="0"
									/>
								</g>
							</g>
						</g>
						<g className="text">
							<g id="e17J4GcJHT">
								<use
									xlinkHref="#a1jKNA7rAN"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a1vZchl36W">
								<use
									xlinkHref="#aAHeijBe5"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="a1LXneLur">
								<use
									xlinkHref="#ek5cw6Hgp"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="btsq7lcvc">
								<use
									xlinkHref="#g2rNJx6rxS"
									opacity="1"
									fill="#000"
								/>
							</g>
							<g id="dber0XavM">
								<use
									xlinkHref="#d14UMdDj6N"
									opacity="1"
									fill="#000"
								/>
							</g>
						</g>
					</g>
				</g>
			</svg>
		);
	}
}
