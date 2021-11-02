import { WithStyles } from "@mui/styles";
import { ColumnProps } from "react-virtualized/dist/es/Table";
import { styles } from "./style";

export interface ColumnData extends ColumnProps {
	numeric?: boolean;
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
	rows: any;
	columns: any;
	height?: string;
}
