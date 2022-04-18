import { useState } from "react";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  useTheme,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useFullDigits } from "../../hooks";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order: "asc" | "desc", orderBy: string) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

interface TableProps {
  sortColumn: string;
  rows: any;
  columns: any;
  onRowClick?: (rowData: any) => void;
  sx?: any;
}

function Table({ rows, columns, onRowClick, sortColumn = "name", sx = {} }: TableProps) {
  const theme = useTheme();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState(sortColumn);
  const { fullDigits } = useFullDigits();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const padding = fullDigits.table ? "0.5rem 0.5rem" : "0.5rem 1rem";

  return (
    <TableContainer
      component={Box}
      sx={{
        maxWidth: 950,
        m: "0 auto",
        mb: "1.5rem",
        width: ["none", "none", "max-content"],
        ...sx,
      }}
    >
      <MUITable aria-label="table">
        <TableHead>
          <TableRow sx={{ padding }}>
            {columns?.map(({ dataKey, label, align, cellStyle, sortLabelStyle }) => (
              <TableCell
                align={align}
                sx={{
                  color: theme.palette.secondary.main,
                  fontSize: 12,
                  padding,
                  ...(cellStyle || {}),
                }}
                key={dataKey}
                sortDirection={orderBy === dataKey ? order : false}
              >
                <TableSortLabel
                  active={orderBy === dataKey}
                  direction={orderBy === dataKey ? order : "asc"}
                  onClick={createSortHandler(dataKey)}
                  sx={{ minWidth: [100, 100, "auto"], ...(sortLabelStyle || {}) }}
                >
                  {label}
                  {orderBy === dataKey ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.sort(getComparator(order, orderBy)).map((rowData, idx) => (
            <TableRow
              key={rowData?.symbol || idx}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: onRowClick && "pointer",
                "&:hover": { background: onRowClick && theme.palette.background.default },
                padding,
              }}
              onClick={() => onRowClick && rowData && onRowClick(rowData)}
            >
              {columns?.map(
                ({ dataKey, align, Cell, cellStyle }) =>
                  Cell && (
                    <TableCell
                      key={dataKey}
                      align={align}
                      sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: "bold",
                        padding,
                        ...(cellStyle || {}),
                      }}
                    >
                      <Cell rowData={rowData} />
                    </TableCell>
                  ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
  );
}

export default Table;
