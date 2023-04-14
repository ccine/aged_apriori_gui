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

var freqItemsetColumns = [
  { label: "Itemset", field: "itemset", type: "string" },
  { label: "Support", field: "support", type: "number" },
];

function FrequentItemsetForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;

  const [contextLevel, setContextLevel] = useState<number>(0); // The context level parameter
  const [userIndex, setUserIndex] = useState<number>(0); // The user index parameter
  const [minSupport, setMinSupport] = useState<number>(0.35); // The minimum support parameter
  const [tempWindow, setTempWindow] = useState<number>(3); // The temporal window parameter
  const [gapsFlag, setGapsFlag] = useState<boolean>(false); // The gaps parameter
  const [agedFlag, setAgedFlag] = useState<boolean>(true); // The aged parameter

  var gridSize = expanded ? 6 : 2;

  const getFrequentItemsets = () => {
    if (!dataset) {
      //TODO
      return;
    }
    if (minSupport <= 0 || minSupport >= 1) {
      //TODO
      return;
    }
    let prepareData = (data: any) =>
      data.map((item: any) => ({
        ...item,
        itemset: item.itemset.map((x: any) => x.fullName).join(", "),
      }));

    getApiResult({
      apiCallUrl: API_CALLS.getFrequentItemset,
      apiParams: {
        contextLevel: contextLevel,
        userIndex: userIndex,
        temporalWindow: tempWindow,
        minSupport: minSupport,
        gapsFlag: gapsFlag,
        aged: agedFlag,
      },
      columns: freqItemsetColumns,
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
    </Box>
  );
}

export default FrequentItemsetForm;
