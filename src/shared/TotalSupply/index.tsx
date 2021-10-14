/* eslint-disable react/prop-types */
//@ts-ignore
import { Button } from "@mui/material";
//@ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
import DesktopBottomBackground from '../../assets/desktop-bottom-background.jpg';
import MobileBottomBackground from '../../assets/mobile-bottom.png';
import { colors } from "../../style";


const DesktopTotalSupplyFooter = ({ height = "10em", displayButton = true }) => {
	return (
		<div style={{ display: "grid", justifyContent: "center", height: "24em", backgroundSize: 'cover', backgroundImage: `url(${DesktopBottomBackground})` }}>
			<div
				style={{
					paddingTop: "3em",
					textAlign: "center",
					height,
					width: "250px",
				}}
			>
				<Button
					variant="contained"
					size="large"
					style={{ display: displayButton ? "unset" : "none", height: "100%", width: "100%", backgroundColor: colors.secondary }}
				>
					{"Total Supply"}
					<br />
					{"10,000,000$"}
				</Button>
			</div>
		</div>
	);
};

const MobileTotalSupplyFooter = ({ height = "7em", displayButton = true }) => {
	return (
		<div
			style={{
				padding: "2em",
				textAlign: "center",
				display: "grid",
				justifyContent: "center",
				height,
				backgroundSize: 'cover', backgroundImage: `url(${MobileBottomBackground})`
			}}
		>
			<Button
				variant="contained"
				size="large"
				style={{ display: displayButton ? "unset" : "none", height: "100%", width: "250px", backgroundColor: colors.secondary }}
			>
				{"Total Supply"}
				<br />
				{"10,000,000$"}
			</Button>
		</div>
	);
};

const TotalSupply = ({ displayButton = true }) => {
	const detectMobile = useMobileDetect();
	const isMobile = detectMobile.isMobile();

	if (isMobile) {
		return <MobileTotalSupplyFooter displayButton={displayButton} />
	} else {
		return <DesktopTotalSupplyFooter displayButton={displayButton} />
	}
}
export default TotalSupply;

// const TotalSupply = ({ height = "7em" }) => {
// 	return (
// 		<div
// 			style={{
// 				paddingTop: "1em",
// 				textAlign: "center",
// 				height,
// 				width: "250px",
// 				backgroundSize: "cover",
// 				backgroundImage: `url(${MobileBottomBackground})`,
// 			}}
// 		>
// 			<Button
// 				variant="contained"
// 				size="large"
// 				style={{ height: "100%", width: "100%", backgroundColor: colors.secondary }}
// 			>
// 				{"Total Supply"}
// 				<br />
// 				{"10,000,000$"}
// 			</Button>
// 		</div>
// 	);
// };
