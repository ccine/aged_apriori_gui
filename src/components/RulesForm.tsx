import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

function RulesForm(props: { dataset: string }) {
  const [contextLevel, setContextLevel] = useState<number>(0); // The context level parameter
  const [userIndex, setUserIndex] = useState<number>(0); // The user index parameter
  const [tempWindow, setTempWindow] = useState<number>(3); // The temporal window parameter
  const [minSupport, setMinSupport] = useState<number>(0.05); // The minimum support parameter
  const [minConfidence, setMinConfidence] = useState<number>(0.8); // The minimum confidence parameter
  const [feature, setFeature] = useState<String>("ZL"); // The feature parameter
  const [gapsFlag, setGapsFlag] = useState<boolean>(false); // The gaps parameter
  const [agedFlag, setAgedFlag] = useState<boolean>(true); // The aged parameter
  const [result, setResult] = useState<Array<any>>([]);

  const getFrequentItemsets = () => {
    if (!props.dataset) {
      //TODO
      return;
    }
    if (minSupport <= 0 || minSupport >= 1) {
      //TODO
      return;
    }
    if (minConfidence <= 0 || minConfidence >= 1) {
      //TODO
      return;
    }
    axios
      .get("http://127.0.0.1:8080/aged-apriori/rules/" + props.dataset, {
        params: {
          contextLevel: contextLevel,
          userIndex: userIndex,
          temporalWindow: tempWindow,
          minSupport: minSupport,
          minConfidence: minConfidence,
          feature: feature,
          gapsFlag: gapsFlag,
          aged: agedFlag,
        },
      })
      .then((response) => {
        setResult(
          response.data.sort(
            (a: { confidence: number }, b: { confidence: number }) => {
              return b.confidence - a.confidence;
            }
          )
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            id="context-level-input"
            label="Context level"
            type="number"
            value={contextLevel}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setContextLevel(Number(event.target.value))
            }
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="user-index-input"
            label="User index"
            type="number"
            value={userIndex}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUserIndex(Number(event.target.value))
            }
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="temp-window-input"
            label="Temporal window"
            type="number"
            value={tempWindow}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTempWindow(Number(event.target.value))
            }
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="min-support-input"
            label="Minimum support"
            type="number"
            value={minSupport}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setMinSupport(Number(event.target.value))
            }
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="min-confidence-input"
            label="Minimum confidence"
            type="number"
            value={minConfidence}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setMinConfidence(Number(event.target.value))
            }
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="feature-input"
            label="Feature"
            type="string"
            value={feature}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFeature(event.target.value)
            }
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={gapsFlag}
                onChange={() => setGapsFlag(!gapsFlag)}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Gaps"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                checked={agedFlag}
                onChange={() => setAgedFlag(!agedFlag)}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Aged"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={getFrequentItemsets}
            color="primary"
            size="large"
          >
            Get Frequent Itemsets
          </Button>
        </Grid>
      </Grid>

      {result.length > 0 && (
        <>
          <Typography sx={{ mt: 4, mb: 1 }}>
            Total row: {result.length}
          </Typography>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="Frequent Itemsets Table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Antecedent</TableCell>
                  <TableCell>Consequent</TableCell>
                  <TableCell align="right">Confidence</TableCell>
                  <TableCell align="right">Support</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography>
                        {row.antecedent[0].fullName}
                        {row.antecedent.length > 1 &&
                          row.antecedent
                            .slice(1, row.antecedent.length)
                            .reduce(
                              (res: string, x: { fullName: string }) =>
                                (res += "," + x.fullName),
                              ""
                            )}
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography>{row.consequent.fullName}</Typography>
                    </TableCell>
                    <TableCell align="right">{row.confidence}</TableCell>
                    <TableCell align="right">{row.support}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

export default RulesForm;
