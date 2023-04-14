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

var validationColumns = [
  { label: "User", field: "user", type: "string" },
  { label: "Aged accuracy", field: "agedAccuracy", type: "number" },
  { label: "Classic accuracy", field: "classicAccuracy", type: "number" },
];

function ValidationForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;

  const [contextLevel, setContextLevel] = useState<number>(0); // The context level parameter
  const [testSize, setTestSize] = useState<number>(20); // The test size parameter
  const [tempWindow, setTempWindow] = useState<number>(3); // The temporal window parameter
  const [minSupport, setMinSupport] = useState<number>(0.3); // The minimum support parameter
  const [minConfidence, setMinConfidence] = useState<number>(0.8); // The minimum confidence parameter
  const [feature, setFeature] = useState<String>("ZL"); // The feature parameter
  const [gapsFlag, setGapsFlag] = useState<boolean>(false); // The gaps parameter

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
    }

    getApiResult({
      apiCallUrl: API_CALLS.getValidation,
      apiParams: {
        contextLevel: contextLevel,
        testSize: testSize,
        temporalWindow: tempWindow,
        minSupport: minSupport,
        minConfidence: minConfidence,
        feature: feature,
        gapsFlag: gapsFlag,
      },
      columns: validationColumns,
      prepareData: (data: any) => data,
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
            id="test-size-input"
            label="Test size"
            type="number"
            value={testSize}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTestSize(Number(event.target.value))
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
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={getFrequentItemsets}
            color="primary"
            size="large"
          >
            Get Validation
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ValidationForm;
