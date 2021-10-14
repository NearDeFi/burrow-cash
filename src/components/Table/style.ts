import { Paper } from "@mui/material";
import { Theme } from "@mui/material/styles";
import styled from "styled-components";

export const styles = (theme: Theme) =>
	({
		borderlessFlexContainer: {
			display: "flex",
			alignItems: "center",
		},
		headerFlexContainer: {
			display: "flex",
			// alignItems: 'center',
			boxSizing: "border-box",
		},
		flexContainer: {
			display: "flex",
			alignItems: "center",
			boxSizing: "border-box",
		},
		table: {
			// temporary right-to-left patch, waiting for
			// https://github.com/bvaughn/react-virtualized/issues/454
			"& .ReactVirtualized__Table__headerRow": {
				...(theme.direction === "rtl" && {
					paddingLeft: "0 !important",
				}),
				...(theme.direction !== "rtl" && {
					paddingRight: undefined,
				}),
			},
		},
		tableRow: {
			cursor: "pointer",
			flex: "0 0 100% !important"
		},
		tableRowHover: {
			"&:hover": {
				backgroundColor: "white",
			},
		},
		tableCell: {
			flex: 1,
		},
		noClick: {
			cursor: "initial",
		},
	} as const);

export const TableWrapper = styled(Paper)<{ height: string }>`
	grid-column: 2;
	width: 100%;
	box-shadow: none !important;
	height: ${(props: { height: string }) => props?.height || "400px"};
`;

export const TokenNameCellWrapper = styled.div`
	display: grid;
	grid-template-columns: 0.5fr 1fr;
`;

export const TokenNameTextWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding-left: 0.3em;
`;

export const DefaultCellWrapper = styled.div`
	justify-self: end;
`;

export const APYCellWrapper = styled.div`
	justify-self: ${(props: { justifySelf: string }) => props.justifySelf};
`;
