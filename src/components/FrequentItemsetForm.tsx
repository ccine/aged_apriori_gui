import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { TabFormProps } from "../types";
import { API_CALLS } from "../config";

var freqItemsetColumns = [
  { label: "Itemset", field: "itemset", type: "string" },
  { label: "Support", field: "support", type: "number" },
];

interface FrequentItemsetFormProps {
  contextLevel: string;
  userIndex: string;
  temporalWindow: string;
  minSupport: string;
  gapsFlag: boolean;
  aged: boolean;
}

interface FrequentItemsetFormErrorProps {
  contextLevel: boolean;
  userIndex: boolean;
  temporalWindow: boolean;
  minSupport: boolean;
}

function FrequentItemsetForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;
  const [formData, setFormData] = useState<FrequentItemsetFormProps>({
    contextLevel: "0",
    userIndex: "0",
    temporalWindow: "3",
    minSupport: "0.35",
    gapsFlag: false,
    aged: true,
  });
  const [formError, setFormError] = useState<FrequentItemsetFormErrorProps>({
    contextLevel: false,
    userIndex: false,
    temporalWindow: false,
    minSupport: false,
  });

  var gridSize = expanded ? 6 : 2;

  const validateForm = (newFormData: FrequentItemsetFormProps) => {
    const checkCL =
      isNaN(parseInt(newFormData.contextLevel)) ||
      Number(newFormData.contextLevel) < 0;
    const checkUI =
      isNaN(parseInt(newFormData.userIndex)) ||
      Number(newFormData.userIndex) < 0 ||
      Number(newFormData.userIndex) >= dataset.userList.length;
    const checkTW =
      isNaN(parseInt(newFormData.temporalWindow)) ||
      Number(newFormData.temporalWindow) < 0;
    const checkMS =
      isNaN(parseInt(newFormData.minSupport)) ||
      Number(newFormData.minSupport) <= 0 ||
      Number(newFormData.minSupport) >= 1;

    setFormError({
      contextLevel: checkCL,
      userIndex: checkUI,
      temporalWindow: checkTW,
      minSupport: checkMS,
    });
  };

  const getFrequentItemsets = () => {
    // If one input is wrong, return
    if (Object.values(formError).includes(true)) return;

    let prepareData = (data: any) =>
      data.map((item: any) => ({
        ...item,
        itemset: item.itemset.map((x: any) => x.fullName).join(", "),
      }));

    const formDataAsNumber = {
      ...formData,
      contextLevel: Number(formData.contextLevel),
      userIndex: Number(formData.userIndex),
      temporalWindow: Number(formData.temporalWindow),
      minSupport: Number(formData.minSupport),
    };

    getApiResult({
      apiCallUrl: API_CALLS.getFrequentItemset,
      apiParams: formDataAsNumber,
      columns: freqItemsetColumns,
      prepareData: prepareData,
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isCheckbox = event.target.type === "checkbox";
    const newFormData = {
      ...formData,
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value,
    };
    validateForm(newFormData);
    setFormData(newFormData);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Grid container spacing={2}>
        <Grid item xs={gridSize}>
          <TextField
            id="context-level-input"
            label="Context level"
            type="number"
            name="contextLevel"
            value={formData.contextLevel}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.contextLevel}
            helperText={
              formError.contextLevel ? "Value between 0 and " /**  TODO*/ : ""
            }
          />
        </Grid>
        <Grid item xs={gridSize}>
        <TextField
            id="user-select"
            select
            variant="outlined"
            margin="normal"
            name="userIndex"
            label="User"
            value={formData.userIndex}
            onChange={handleChange}
          >
            {dataset.userList.map((item, index) => (
              <MenuItem value={index} key={index}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={gridSize}>
          <TextField
            id="temp-window-input"
            label="Temporal window"
            type="number"
            name="temporalWindow"
            value={formData.temporalWindow}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.temporalWindow}
            helperText={
              formError.temporalWindow ? "Value must be greater than 0" : ""
            }
          />
        </Grid>
        <Grid item xs={gridSize}>
          <TextField
            id="min-support-input"
            label="Minimum support"
            type="number"
            name="minSupport"
            value={formData.minSupport}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.minSupport}
            helperText={formError.minSupport ? "Value between 0 and 1" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                name="gapsFlag"
                checked={formData.gapsFlag}
                onChange={handleChange}
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
                name="agedFlag"
                checked={formData.aged}
                onChange={handleChange}
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
