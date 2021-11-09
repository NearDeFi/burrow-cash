import {
	Table as MUITable,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Box,
} from "@mui/material";

function Table({ rows, columns }) {
	console.log(columns, rows);
	return (
		<TableContainer component={Box} sx={{ maxWidth: 750, m: "0 auto" }}>
			<MUITable aria-label="table">
				<TableHead>
					<TableRow>
						{columns?.map(({ dataKey, label }) => (
							<TableCell key={dataKey}>{label}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((rowData) => (
						<TableRow
							key={rowData.token_id}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
						>
							{columns?.map(
								({ dataKey, Cell }) =>
									Cell && (
										<TableCell>
											<Cell key={dataKey} rowData={rowData} />
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
