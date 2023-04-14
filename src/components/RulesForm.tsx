import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { TabFormProps } from "../types";
import { API_CALLS } from "../config";

var rulesColumns = [
  { label: "Antecedent", field: "antecedent", type: "string" },
  { label: "Consequent", field: "consequent", type: "string" },
  { label: "Confidence", field: "confidence", type: "number" },
  { label: "Support", field: "support", type: "number" },
  { label: "Completeness", field: "completeness", type: "number" },
];

function RulesForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;

  const [contextLevel, setContextLevel] = useState<number>(0); // The context level parameter
  const [userIndex, setUserIndex] = useState<number>(0); // The user index parameter
  const [tempWindow, setTempWindow] = useState<number>(3); // The temporal window parameter
  const [minSupport, setMinSupport] = useState<number>(0.05); // The minimum support parameter
  const [minConfidence, setMinConfidence] = useState<number>(0.8); // The minimum confidence parameter
  const [feature, setFeature] = useState<String>("ZL"); // The feature parameter
  const [gapsFlag, setGapsFlag] = useState<boolean>(false); // The gaps parameter
  const [agedFlag, setAgedFlag] = useState<boolean>(true); // The aged parameter

  var gridSize = expanded ? 4 : 2;

  const getFrequentItemsets = () => {
    if (!dataset) {
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
    let prepareData = (data: any) =>
      data.map((item: any) => ({
        ...item,
        antecedent: item.antecedent.map((ant: any) => ant.fullName).join(", "),
        consequent: item.consequent.fullName,
      }));

    getApiResult({
      apiCallUrl: API_CALLS.getRules,
      apiParams: {
        contextLevel: contextLevel,
        userIndex: userIndex,
        temporalWindow: tempWindow,
        minSupport: minSupport,
        minConfidence: minConfidence,
        feature: feature,
        gapsFlag: gapsFlag,
        aged: agedFlag,
      },
      columns: rulesColumns,
      prepareData: prepareData,
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Grid container spacing={2}>
        <Grid item xs={gridSize}>
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
        <Grid item xs={gridSize}>
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
        <Grid item xs={gridSize}>
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
        <Grid item xs={gridSize}>
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
        <Grid item xs={gridSize}>
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
        <Grid item xs={gridSize}>
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
            Get Rules
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RulesForm;
