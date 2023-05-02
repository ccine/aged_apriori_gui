import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { TabFormProps } from "../types";
import { API_CALLS } from "../config";

var freqItemsetColumns = [
  { label: "Itemset", field: "itemset", type: "string" },
  { label: "Support", field: "support", type: "number" },
];

interface FrequentItemsetFormProps {
  contextCols: string[];
  userIndex: string;
  temporalWindow: string;
  minSupport: string;
  gapsFlag: boolean;
  aged: boolean;
}

interface FrequentItemsetFormErrorProps {
  contextCols: boolean;
  userIndex: boolean;
  temporalWindow: boolean;
  minSupport: boolean;
}

function FrequentItemsetForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;
  const [formData, setFormData] = useState<FrequentItemsetFormProps>({
    contextCols: [],
    userIndex: "0",
    temporalWindow: "3",
    minSupport: "0.35",
    gapsFlag: false,
    aged: true,
  });
  const [formError, setFormError] = useState<FrequentItemsetFormErrorProps>({
    contextCols: false,
    userIndex: false,
    temporalWindow: false,
    minSupport: false,
  });

  var gridSize = expanded ? 6 : 3;

  const validateForm = (newFormData: FrequentItemsetFormProps) => {
    const checkCC = !formData.contextCols.every((elem) =>
      dataset.contextCols.includes(elem)
    );
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
      contextCols: checkCC,
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
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }} alignItems="end">
        <Grid item xs={gridSize}>
          <FormControl sx={{ mb: 1 }} fullWidth>
            <InputLabel id="context-label">Context</InputLabel>
            <Select
              labelId="context-label"
              id="context-multiple-select"
              multiple
              value={formData.contextCols}
              name="contextCols"
              disabled={!dataset.contextCols}
              onChange={(e) => {
                const newFormData = {
                  ...formData,
                  [e.target.name]: e.target.value,
                };
                setFormData(newFormData);
              }}
              input={<OutlinedInput label="Context" />}
            >
              {dataset.contextCols &&
                dataset.contextCols.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
            fullWidth
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
            fullWidth
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
            fullWidth
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
