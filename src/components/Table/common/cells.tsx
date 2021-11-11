import { Box } from "@mui/material";

import TokenIcon from "../../TokenIcon";
import { USD_FORMAT } from "../../../store/constants";

export const TokenCell = ({ rowData }) => {
	const { symbol, price } = rowData;
	return (
		<Box display="flex">
			<Box>
				<TokenIcon icon={rowData?.icon} />
			</Box>
			<Box px="1rem">
				<Box>{symbol}</Box>
				<Box>{price ? `${rowData.price.usd.toLocaleString(undefined, USD_FORMAT)}` : "$-.-"}</Box>
			</Box>
		</Box>
	);
};
