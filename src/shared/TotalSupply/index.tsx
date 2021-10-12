import { Button } from "@mui/material";

const TotalSupply = () => {
	return (
		<div style={{ paddingTop: "1em", textAlign: "center", height: "8em" }}>
			<Button variant="contained" size="large" style={{ height: "6em", width: "14em" }}>
				{"Total Supply"}
				<br />
				{"10,000,000$"}
			</Button>
		</div>
	);
};

export default TotalSupply;
