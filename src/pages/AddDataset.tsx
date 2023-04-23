import { ChangeEvent, useState } from "react";
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
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useNavigate } from "react-router-dom";

function AddDataset() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileError, setFileError] = useState<string>();
  const [datasetInfo, setDatasetInfo] = useState<{
    name: string;
    userIndex: number;
    contextIndexes: number[];
  }>({ name: "", userIndex: 0, contextIndexes: [] });

  const handleChangeFile = (newValue: File | null) => {
    setFile(newValue);
    if (!newValue) {
      setFileContent("");
      setFileError("");
      return;
    }
    if (!newValue.name.endsWith(".csv")) {
      setFileContent("");
      setFileError("The file must be a .csv");
      return;
    }
    if (newValue) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(newValue);
    }
  };

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...datasetInfo,
      [event.target.name]: event.target.value,
    };
    setDatasetInfo(newFormData);
  };

  const parseFirstRow = (): string[] | undefined => {
    const rows = fileContent.trim().split(/\r?\n/);
    if (rows.length === 0 || !rows[0] || rows[0].split(",").length === 0) {
      //setFileError("Unable to parse first row of file")
      return undefined;
    }
    return rows[0].split(",");
  };
  const columns = parseFirstRow();

  const mdTheme = createTheme();

  const navigate = useNavigate();

  const sendDataset = (): void => {
    //navigate("/");
    console.log(datasetInfo);
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
            {fileContent && columns && (
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
                      <InputLabel id="context-label">
                        Context
                      </InputLabel>
                      <Select
                        labelId="context-label"
                        id="context-multiple-select"
                        multiple
                        value={datasetInfo.contextIndexes}
                        name="contextIndexes"
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
                          <MenuItem key={index} value={index}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={sendDataset}
                    >
                      Add dataset
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
            {fileError && (
              <Box sx={{ mt: 2 }}>
                <Typography color="error">Error: {fileError}</Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AddDataset;
