import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

function ValidationForm(props: { dataset: string }) {
  const [contextLevel, setContextLevel] = useState<number>(0); // The context level parameter
  const [testSize, setTestSize] = useState<number>(20); // The test size parameter
  const [tempWindow, setTempWindow] = useState<number>(3); // The temporal window parameter
  const [minSupport, setMinSupport] = useState<number>(0.3); // The minimum support parameter
  const [minConfidence, setMinConfidence] = useState<number>(0.8); // The minimum confidence parameter
  const [feature, setFeature] = useState<String>("ZL"); // The feature parameter
  const [gapsFlag, setGapsFlag] = useState<boolean>(false); // The gaps parameter
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
      .get("http://127.0.0.1:8080/aged-apriori/validation/" + props.dataset, {
        params: {
          contextLevel: contextLevel,
          testSize: testSize,
          temporalWindow: tempWindow,
          minSupport: minSupport,
          minConfidence: minConfidence,
          feature: feature,
          gapsFlag: gapsFlag,
        },
      })
      .then((response) => {
        console.log(response.data);
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
          {JSON.stringify(result)}
        </>
      )}
    </Box>
  );
}

export default ValidationForm;
