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

function Table({ rows, columns }) {
	const theme = useTheme();
	return (
		<TableContainer component={Box} sx={{ maxWidth: 750, m: "0 auto" }}>
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
					{rows.map((rowData) => (
						<TableRow
							key={rowData.token_id}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
						>
							{columns?.map(
								({ dataKey, align, Cell }) =>
									Cell && (
										<TableCell
											align={align}
											sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }}
										>
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
