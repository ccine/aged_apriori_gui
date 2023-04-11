import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Grid,
  Typography,
  Container,
  TextField,
  Stack,
  TableFooter,
  TablePagination,
} from "@mui/material";
import TablePaginationActions from "./TablePaginationActions";

function ResultComponent(props: {
  result: {
    columns: { label: string; field: string; type: string }[];
    data: { [field: string]: string | number }[];
  };
}) {
  const [filteredData, setFilteredData] = useState(props.result.data);
  const [filters, setFilters] = useState<{ [x: string]: string | number }>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  useEffect(() => {
    setFilters({});
    setFilteredData(props.result.data);
  }, [props.result]);

  useEffect(() => {
    // filtra i dati in base ai filtri selezionati
    const filtered = props.result.data.filter((item) => {
      let passFilter = true;
      for (const [key, value] of Object.entries(filters)) {
        if (!String(item[key]).includes(String(value))) {
          passFilter = false;
        }
      }
      return passFilter;
    });
    setFilteredData(filtered);
  }, [filters, props.result.data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Container component={Paper}>
          <Stack spacing={2} sx={{ pb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Filters
            </Typography>
            {filteredData &&
              props.result.columns.map((column: any, index: number) => (
                <TextField
                  id="user-index-input"
                  label={column.label}
                  type={column.type}
                  variant="outlined"
                  margin="normal"
                  value={filters[column.field] || ""}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFilters({
                      ...filters,
                      [column.field]: event.target.value,
                    });
                  }}
                />
              ))}
          </Stack>
        </Container>
      </Grid>

      <Grid item xs={9}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* elenco di intestazioni di colonna dinamiche in base alla tab selezionata */}
                {props.result.columns.map((column, index: number) => (
                  <TableCell key={index}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* elenco di righe di dati dinamiche in base ai dati filtrati */}
              {(rowsPerPage > 0
                ? filteredData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredData
              ).map(
                (
                  row: {
                    [x: string]: string | number;
                  },
                  index: number
                ) => (
                  <TableRow key={index}>
                    {props.result.columns.map((column, index: number) => (
                      <TableCell key={index}>{row[column.field]}</TableCell>
                    ))}
                  </TableRow>
                )
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50, { label: "All", value: -1 }]}
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={(
                    event: React.MouseEvent<HTMLButtonElement> | null,
                    newPage: number
                  ) => setPage(newPage)}
                  onRowsPerPageChange={(
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ResultComponent;
