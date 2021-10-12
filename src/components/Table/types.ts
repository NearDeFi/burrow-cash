import { WithStyles } from "@mui/styles";
import { styles } from "./style";

export interface ColumnData {
	dataKey: string;
	label: string;
	numeric?: boolean;
	width: number;
}

export interface Row {
	index: number;
}

export interface Data {
	id: number;
}

export type Sample = [string, number, boolean];

export interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
	columns: readonly ColumnData[];
	headerHeight?: number;
	onRowClick?: () => void;
	rowCount: number;
	rowGetter: (row: Row) => Data;
	rowHeight?: number;
}

export interface TableProps {
	rows: any,
	columns: any,
	height?: string,
}