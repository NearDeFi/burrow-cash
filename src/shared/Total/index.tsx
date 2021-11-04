/* eslint-disable react/prop-types */
// @ts-ignore
import { Button } from "@mui/material";
// @ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
import { colors } from "../../style";

const DesktopTotalFooter = ({ height = "10em", displayButton = true, value, type }) => {
	return (
		<div
			style={{
				display: "grid",
				justifyContent: "center",
				height: "24em",
				backgroundSize: "cover",
			}}
		>
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
					style={{
						display: displayButton ? "unset" : "none",
						height: "100%",
						width: "100%",
						backgroundColor: colors.secondary,
					}}
				>
					{`Total ${type}`}
					<br />
					{value}
				</Button>
			</div>
		</div>
	);
};

const MobileTotalFooter = ({ height = "7em", displayButton = true, value, type = "Supply" }) => {
	return (
		<div
			style={{
				padding: "2em",
				textAlign: "center",
				display: "grid",
				justifyContent: "center",
				height,
				backgroundSize: "cover",
			}}
		>
			<Button
				variant-bg="contained"
				size="large"
				style={{
					display: displayButton ? "unset" : "none",
					height: "100%",
					width: "250px",
					backgroundColor: colors.secondary,
				}}
			>
				{`Total ${type}`}
				<br />
				{value}
			</Button>
		</div>
	);
};

const Total = ({ displayButton = true, value, type }) => {
	const detectMobile = useMobileDetect();
	const isMobile = detectMobile.isMobile();

	if (isMobile) {
		return <MobileTotalFooter displayButton={displayButton} value={value} type={type} />;
	}
	return <DesktopTotalFooter displayButton={displayButton} value={value} type={type} />;
};

export default Total;

// const TotalSupply = ({ height = "7em" }) => {
// 	return (
// 		<div
// 			style={{
// 				paddingTop: "1em",
// 				textAlign: "center",
// 				height,
// 				width: "250px",
// 				backgroundSize: "cover",
// 				backgroundImage: `url(${mobileBottomBg})`,
// 			}}
// 		>
// -bg 			<Button
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
