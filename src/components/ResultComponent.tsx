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
  Toolbar,
  IconButton,
  Tooltip,
  TableSortLabel,
  Box,
} from "@mui/material";
import TablePaginationActions from "./TablePaginationActions";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import { visuallyHidden } from "@mui/utils";
import Papa from "papaparse"

const DEFAULT_ORDER = "asc";
const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_SHOW_FILTERS = false;

function ResultComponent(props: {
  result: {
    columns: { label: string; field: string; type: string }[];
    data: { [field: string]: string | number }[];
  };
}) {
  const [filteredData, setFilteredData] = useState(props.result.data);
  const [filters, setFilters] = useState<{ [x: string]: string | number }>({});
  const [showFilters, setShowFilters] = useState<boolean>(DEFAULT_SHOW_FILTERS);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER);
  const [orderByIndex, setOrderByIndex] = React.useState<number>(0);
  const [page, setPage] = React.useState(0);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  useEffect(() => {
    setFilters({});
    setFilteredData(props.result.data);
  }, [props.result]);

  useEffect(() => {
    // Filter data
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

  const handleRequestSort = React.useCallback(
    (newOrderBy: number) => {
      const isAsc = orderByIndex === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderByIndex(newOrderBy);

      const sortedRows = stableSort(
        filteredData,
        getComparator(toggledOrder, props.result.columns[newOrderBy].field)
      );
      setFilteredData(sortedRows);
    },
    [filteredData, order, orderByIndex, props.result.columns]
  );

  function handleDownloadCsv() {
    const csv = Papa.unparse(props.result.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Grid container spacing={2}>
      {showFilters && (
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
                    key={index}
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
      )}

      <Grid item xs={showFilters ? 9 : 12}>
        <Paper sx={{ width: "100%" }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            }}
          >
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Results - {filteredData.length} rows
            </Typography>
            <Tooltip title="Download CSV">
              <IconButton onClick={handleDownloadCsv}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter list">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {props.result.columns.map((column, index: number) => (
                    <TableCell
                      key={index}
                      align={column.type === "numeric" ? "right" : "left"}
                      sortDirection={orderByIndex === index ? order : false}
                    >
                      <TableSortLabel
                        active={orderByIndex === index}
                        direction={orderByIndex === index ? order : "asc"}
                        onClick={() => handleRequestSort(index)}
                      >
                        {column.label}
                        {orderByIndex === index ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
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
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      50,
                      { label: "All", value: -1 },
                    ]}
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
        </Paper>
      </Grid>
    </Grid>
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default ResultComponent;
