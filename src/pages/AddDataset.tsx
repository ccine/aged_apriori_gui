import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CALLS } from "../config";
import Papa from "papaparse";

function AddDataset() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [nameError, setNameError] = useState<boolean>(true);
  const [successUpload, setSuccessUpload] = useState<boolean>(false);
  const [datasetInfo, setDatasetInfo] = useState<{
    name: string;
    userIndex: number;
    contextCols: string[];
  }>({ name: "", userIndex: 0, contextCols: [] });

  const handleChangeFile = (newValue: File | null) => {
    setFile(newValue);
    setSuccessUpload(false);
    setColumns([]);
    if (!newValue) {
      setFileError("");
      return;
    }
    if (!newValue.name.endsWith(".csv")) {
      setFileError("The file must be a .csv");
      return;
    }
    if (newValue) {
      // Parse local CSV file
      Papa.parse(newValue, {
        preview: 1,
        complete: function (results: { data: string[][] }) {
          setColumns(results.data[0]);
        },
      });
    }
  };

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) => {
    // Handle new value
    const newFormData = {
      ...datasetInfo,
      [event.target.name]: event.target.value,
    };
    // Remove user column from available context columns
    const removeFromContext = {
      ...newFormData,
      contextCols: newFormData.contextCols.filter(
        (value) => value !== columns[newFormData.userIndex]
      ),
    };
    setDatasetInfo(removeFromContext);
    setNameError(newFormData.name === "");
  };

  const mdTheme = createTheme();

  const navigate = useNavigate();

  const sendDataset = (): void => {
    setFileError("");
    setSuccessUpload(false);
    if (!file || !columns) {
      setFileError("File Error");
      return;
    }
    const formData = new FormData();
    formData.append("name", datasetInfo.name);
    formData.append("userIndex", String(datasetInfo.userIndex));
    formData.append("file", file);
    formData.append("contextCols", JSON.stringify(datasetInfo.contextCols));

    axios
      .post(API_CALLS.sendDataset, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data === "Uploaded") setSuccessUpload(true);
      })
      .catch((error) => {
        console.error(error);
        if (typeof error.response.data === "string")
          setFileError(error.response.data);
        else setFileError("Server Error");
      });
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography sx={{ mb: 4 }} variant="h2" gutterBottom>
              Aged Apriori
            </Typography>
          </Container>
          <Container maxWidth="md" sx={{ pt: 2, pb: 2 }} component={Paper}>
            <Typography variant="h5" gutterBottom>
              Upload new dataset
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Upload .csv file with columns name on the first line.
            </Typography>
            <MuiFileInput
              value={file}
              onChange={handleChangeFile}
              placeholder="Add new dataset"
            />
            <br />
            {columns.length > 0 ? (
              <Box sx={{ borderTop: 1, borderColor: "divider", mt: 2 }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography>Insert a dataset name:</Typography>
                    <TextField
                      id="dataset-name-input"
                      name="name"
                      label="Dataset name"
                      type="string"
                      value={datasetInfo?.name}
                      onChange={handleChangeForm}
                      variant="outlined"
                      margin="normal"
                      error={nameError}
                      helperText={nameError ? "Name is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Select the user column:</Typography>
                    <TextField
                      id="user-select"
                      select
                      variant="outlined"
                      margin="normal"
                      name="userIndex"
                      label="User"
                      value={datasetInfo.userIndex}
                      onChange={handleChangeForm}
                    >
                      {columns.map((item, index) => (
                        <MenuItem value={index} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Select the context columns:</Typography>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="context-label">Context</InputLabel>
                      <Select
                        labelId="context-label"
                        id="context-multiple-select"
                        multiple
                        value={datasetInfo.contextCols}
                        name="contextCols"
                        onChange={(e) => {
                          const newFormData = {
                            ...datasetInfo,
                            [e.target.name]: e.target.value,
                          };
                          setDatasetInfo(newFormData);
                        }}
                        input={<OutlinedInput label="Context" />}
                      >
                        {columns.map((name, index) => (
                          <MenuItem
                            key={index}
                            value={name}
                            disabled={index === datasetInfo.userIndex}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={sendDataset}
                      >
                        Add dataset
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/")}
                      >
                        Go back
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
                onClick={() => navigate("/")}
              >
                Go back
              </Button>
            )}
            {fileError && (
              <Box sx={{ mt: 2 }}>
                <Typography color="error">Error: {fileError}</Typography>
              </Box>
            )}
            {successUpload && (
              <Box sx={{ mt: 2 }}>
                <Typography color="green">Dataset uploaded</Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AddDataset;
