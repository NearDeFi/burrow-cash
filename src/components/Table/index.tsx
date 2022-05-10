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
import { useFullDigits } from "../../hooks/useFullDigits";
import { IOrder } from "../../redux/appSlice";

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
  sorting: {
    name: string;
    property: string;
    order: IOrder;
    setSorting: (name: string, property: string, order: IOrder) => void;
  };
  rows: any;
  columns: any;
  onRowClick?: (rowData: any) => void;
  sx?: any;
}

function Table({ rows, columns, onRowClick, sorting, sx = {} }: TableProps) {
  const theme = useTheme();
  const { fullDigits } = useFullDigits();

  const handleRequestSort = (event, property) => {
    sorting.setSorting(sorting.name, property, sorting.order === "asc" ? "desc" : "asc");
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const padding = fullDigits?.table ? "0.5rem 0.5rem" : "0.5rem 1rem";

  return (
    <TableContainer
      component={Box}
      sx={{
        maxWidth: 950,
        m: "0 auto",
        mb: "1.5rem",
        px: "1rem",
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
                sortDirection={sorting.property === dataKey ? sorting.order : false}
              >
                <TableSortLabel
                  active={sorting.property === dataKey}
                  direction={sorting.property === dataKey ? sorting.order : "asc"}
                  onClick={createSortHandler(dataKey)}
                  sx={{ minWidth: [100, 100, "auto"], ...(sortLabelStyle || {}) }}
                >
                  {label}
                  {sorting.property === dataKey ? (
                    <Box component="span" sx={visuallyHidden}>
                      {sorting.property === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.sort(getComparator(sorting.order, sorting.property)).map((rowData, idx) => (
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
