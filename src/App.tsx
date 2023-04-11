import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import FrequentItemsetForm from "./components/FrequentItemsetForm";
import RulesForm from "./components/RulesForm";
import ValidationForm from "./components/ValidationForm";
import ResultComponent from "./components/ResultComponent";
import EnhancedTable from "./components/test sort table";
import { a11yProps, TabPanel } from "./components/TabFunction";

function App() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState<
    { name: string; numberOfUsers: number }[]
  >([]);
  const [chosenDataset, setChosenDataset] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [result, setResult] = useState<{ columns: any[]; data: any[] }>();

  const mdTheme = createTheme();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/aged-apriori/datasets")
      .then((response) => {
        setDatasets(response.data);
        setChosenDataset(response.data[0].name);
        setLoading(false);
      })
      .catch((error) => console.error(error));
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
            {loading && (
              <Typography sx={{ mt: 4 }}>
                Impossibile collegarsi al server
              </Typography>
            )}
          </Container>
          {!loading && datasets.length > 0 && (
            <>
              <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} component={Paper}>
                <Container>
                  <FormControl fullWidth sx={{ mt: 4 }}>
                    <InputLabel id="dataset-select-label">Dataset</InputLabel>
                    <Select
                      labelId="dataset-select-label"
                      id="dataset-select"
                      value={chosenDataset}
                      label="Dataset"
                      onChange={(event: SelectChangeEvent) =>
                        setChosenDataset(event.target.value as string)
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
                  <Button variant="text" color="primary" size="large">
                    Add dataset
                  </Button>
                </Container>
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
                    setResult={setResult}
                    expanded={result == null}
                  />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <RulesForm
                    dataset={chosenDataset}
                    setResult={setResult}
                    expanded={result == null}
                  />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                  <ValidationForm
                    dataset={chosenDataset}
                    setResult={setResult}
                    expanded={result == null}
                  />
                </TabPanel>
              </Container>
              {result && (
                <Container
                  sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}
                >
                  <ResultComponent
                    result={result}
                  />
                </Container>
              )}
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}



export default App;
