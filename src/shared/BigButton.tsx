/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import { colors } from "../style";

const DesktopBigButton = ({ height = "10em" }) => {
	return (
		<div style={{ display: "grid", justifyContent: "center", height: "24em" }}>
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
					style={{ height: "100%", width: "100%", backgroundColor: colors.secondary }}
				>
					{"Total Supply"}
					<br />
					{"10,000,000$"}
				</Button>
			</div>
		</div>
	);
};

const BigButton = () => {
	return <DesktopBigButton />;
};

export default BigButton;
