import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { TabFormProps } from "../types";
import { API_CALLS } from "../config";

var validationColumns = [
  { label: "User", field: "user", type: "string" },
  { label: "Aged Rules Number", field: "agedRulesNumber", type: "number" },
  { label: "Aged Matched", field: "agedMatched", type: "number" },
  { label: "Aged accuracy", field: "agedAccuracy", type: "number" },
  { label: "Classic Rules Number", field: "classicRulesNumber", type: "number" },
  { label: "Classic Matched", field: "classicMatched", type: "number" },
  { label: "Classic accuracy", field: "classicAccuracy", type: "number" },
];

interface ValidationFormProps {
  contextCols: string[];
  testSize: string;
  temporalWindow: string;
  minSupport: string;
  minConfidence: string;
  feature: string;
  gapsFlag: boolean;
}

interface ValidationFormErrorProps {
  contextCols: boolean;
  testSize: boolean;
  temporalWindow: boolean;
  minSupport: boolean;
  minConfidence: boolean;
  feature: boolean;
}

function ValidationForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;
  const [formData, setFormData] = useState<ValidationFormProps>({
    contextCols: [],
    testSize: "20",
    temporalWindow: "3",
    minSupport: "0.05",
    minConfidence: "0.8",
    feature: "ZL",
    gapsFlag: false,
  });
  const [formError, setFormError] = useState<ValidationFormErrorProps>({
    contextCols: false,
    testSize: false,
    temporalWindow: false,
    minSupport: false,
    minConfidence: false,
    feature: false,
  });

  var gridSize = expanded ? 4 : 2;

  const validateForm = (newFormData: ValidationFormProps) => {
    const checkCC = !formData.contextCols.every((elem) =>
      dataset.contextCols.includes(elem)
    );
    const checkTS =
      isNaN(parseInt(newFormData.testSize)) || Number(newFormData.testSize) < 0;
    const checkTW =
      isNaN(parseInt(newFormData.temporalWindow)) ||
      Number(newFormData.temporalWindow) < 0;
    const checkMS =
      isNaN(parseInt(newFormData.minSupport)) ||
      Number(newFormData.minSupport) <= 0 ||
      Number(newFormData.minSupport) >= 1;
    const checkMC =
      isNaN(parseInt(newFormData.minConfidence)) ||
      Number(newFormData.minConfidence) <= 0 ||
      Number(newFormData.minConfidence) >= 1;
    const checkF = newFormData.feature === "";

    setFormError({
      contextCols: checkCC,
      testSize: checkTS,
      temporalWindow: checkTW,
      minSupport: checkMS,
      minConfidence: checkMC,
      feature: checkF,
    });
  };

  const getFrequentItemsets = () => {
    // If one input is wrong, return
    if (Object.values(formError).includes(true)) return;

    const formDataAsNumber = {
      ...formData,
      testSize: Number(formData.testSize),
      temporalWindow: Number(formData.temporalWindow),
      minSupport: Number(formData.minSupport),
      minConfidence: Number(formData.minConfidence),
    };

    getApiResult({
      apiCallUrl: API_CALLS.getValidation,
      apiParams: formDataAsNumber,
      columns: validationColumns,
      prepareData: (data: any) => data,
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
            id="test-size-input"
            label="Test size"
            type="number"
            name="testSize"
            value={formData.testSize}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.testSize}
            helperText={
              formError.temporalWindow ? "Value must be greater than 0" : ""
            }
            fullWidth
          />
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
        <Grid item xs={gridSize}>
          <TextField
            id="min-confidence-input"
            label="Minimum confidence"
            type="number"
            name="minConfidence"
            value={formData.minConfidence}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.minConfidence}
            helperText={formError.minSupport ? "Value between 0 and 1" : ""}
            fullWidth
          />
        </Grid>
        <Grid item xs={gridSize}>
          <TextField
            id="feature-input"
            label="Feature"
            type="string"
            name="feature"
            value={formData.feature}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.feature}
            helperText={formError.feature ? "Value in list" : ""}
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
