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
  useMediaQuery,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

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
}

function Table({ rows, columns, onRowClick, sortColumn = "name" }: TableProps) {
  const theme = useTheme();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState(sortColumn);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  let padding = "1rem";
  columns[0].label = "Asset";
  columns[1].minWidth = 100;
  columns[4].minWidth = 100;
  if (isMobile) {
    console.log(isMobile);
    padding = "0.5rem";
    columns[5].minWidth = 100;

    columns[1].label = "BRRR";
    columns[2].label = "APY";
    columns[4].label = "Liquidity";
    columns[3].label = "Deposits";
    if (/deposit/i.test(window.location.href)) {
      columns[5].label = "Deposited";
    }
    if (/borrow/i.test(window.location.href)) {
      columns[2].label = "(APY)";
      columns[4].label = "C. Factor";
      columns[5].label = "Borrowed";
    }
  }

  return (
    <TableContainer component={Box} sx={{ maxWidth: 950, m: "0 auto", mb: "1.5rem" }}>
      <MUITable aria-label="table">
        <TableHead>
          <TableRow sx={{ padding }}>
            {columns?.map(({ dataKey, label, align, minWidth }) => (
              <TableCell
                align={align}
                sx={{
                  color: theme.palette.secondary.main,
                  fontSize: 12,
                  padding,
                  minWidth,
                }}
                key={dataKey}
                sortDirection={orderBy === dataKey ? order : false}
              >
                <TableSortLabel
                  active={orderBy === dataKey}
                  direction={orderBy === dataKey ? order : "asc"}
                  onClick={createSortHandler(dataKey)}
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
                ({ dataKey, align, Cell }) =>
                  Cell && (
                    <TableCell
                      key={dataKey}
                      align={align}
                      sx={{ color: theme.palette.secondary.main, fontWeight: "bold", padding }}
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
