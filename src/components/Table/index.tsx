import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  useTheme,
} from "@mui/material";

interface TableProps {
  rows: any;
  columns: any;
  onRowClick?: (rowData: any) => void;
}

function Table({ rows, columns, onRowClick }: TableProps) {
  const theme = useTheme();
  return (
    <TableContainer component={Box} sx={{ maxWidth: "100%", m: "0 auto" }}>
      <MUITable aria-label="table">
        <TableHead>
          <TableRow>
            {columns?.map(({ dataKey, label, align }) => (
              <TableCell
                align={align}
                sx={{ color: theme.palette.secondary.main, fontSize: 12 }}
                key={dataKey}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((rowData, idx) => (
            <TableRow
              key={rowData?.symbol || idx}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: onRowClick && "pointer",
                "&:hover": { background: onRowClick && theme.palette.background.default },
              }}
              onClick={() => onRowClick && rowData && onRowClick(rowData)}
            >
              {columns?.map(
                ({ dataKey, align, Cell }) =>
                  Cell && (
                    <TableCell
                      key={dataKey}
                      align={align}
                      sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }}
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
