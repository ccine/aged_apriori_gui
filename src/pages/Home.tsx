import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import FrequentItemsetForm from "../components/FrequentItemsetForm";
import RulesForm from "../components/RulesForm";
import ValidationForm from "../components/ValidationForm";
import ResultComponent from "../components/ResultComponent";
import { a11yProps, TabPanel } from "../components/TabFunction";
import { DatasetInfo, ResultType, getApiResultProps } from "../types";
import { API_CALLS } from "../config";
import { useNavigate } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [chosenDataset, setChosenDataset] = useState<DatasetInfo>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [result, setResult] = useState<ResultType>();
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();
  const mdTheme = createTheme();

  const getResultFromServer = (props: getApiResultProps) => {
    const { apiCallUrl, apiParams, columns, prepareData } = props;

    setLoading(true);
    axios
      .get(apiCallUrl(chosenDataset!.name), {
        params: apiParams,
      })
      .then((response) => {
        setResult({ columns: columns, data: prepareData(response.data) });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  };

  const getDatasets = () => {
    setError(false);
    setLoading(true);
    axios
      .get(API_CALLS.getDatasets)
      .then((response: { data: DatasetInfo[] }) => {
        setDatasets(response.data);
        setChosenDataset(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    getDatasets();
  }, []);

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
          {/** INPUT FORM */}
          {datasets.length > 0 && chosenDataset && (
            <>
              <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} component={Paper}>
                {/** DATASET SELECTION */}
                <Stack alignItems="start" sx={{ pt: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="dataset-select-label">Dataset</InputLabel>
                    <Select
                      labelId="dataset-select-label"
                      id="dataset-select"
                      value={chosenDataset.name}
                      label="Dataset"
                      onChange={(event: SelectChangeEvent) =>
                        setChosenDataset(
                          datasets.find(
                            ({ name }) =>
                              name === (event.target.value as string)
                          )
                        )
                      }
                    >
                      {datasets.map((item, index) => (
                        <MenuItem value={item.name} key={index}>
                          {item.name.charAt(0).toUpperCase() +
                            item.name.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="text"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/adddataset")}
                  >
                    Add new dataset
                  </Button>
                  {/*<Divider orientation="vertical" flexItem />
                    <FileUpload />*/}
                </Stack>
                {/** TABS */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
                  <Tabs
                    value={tabIndex}
                    onChange={(event: React.SyntheticEvent, newValue: number) =>
                      setTabIndex(newValue)
                    }
                    aria-label="Function Tab"
                  >
                    <Tab label="Frequent Itemsets" {...a11yProps(0)} />
                    <Tab label="Rules" {...a11yProps(1)} />
                    <Tab label="Validation" {...a11yProps(2)} />
                  </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                  <FrequentItemsetForm
                    dataset={chosenDataset}
                    getApiResult={getResultFromServer}
                    expanded={result == null}
                  />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <RulesForm
                    dataset={chosenDataset}
                    getApiResult={getResultFromServer}
                    expanded={result == null}
                  />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                  <ValidationForm
                    dataset={chosenDataset}
                    getApiResult={getResultFromServer}
                    expanded={result == null}
                  />
                </TabPanel>
              </Container>
              {result && !loading && (
                <Container
                  sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}
                >
                  <ResultComponent result={result} />
                </Container>
              )}
            </>
          )}

          {/** LOADING ANIMATION */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {/** ERROR */}
          {!loading && error && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                maxWidth: "500px",
                height: "fit-content",
                p: 4,
                mx: "auto",
                my: "auto",
              }}
              component={Paper}
            >
              <Typography
                variant="h6"
                color="error"
                align="center"
                gutterBottom
              >
                Connection Error
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                Failed to retrieve data. Please check the server status and try
                again.
              </Typography>
              <Button sx={{ mt: 2 }} variant="contained" onClick={getDatasets}>
                Retry
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
