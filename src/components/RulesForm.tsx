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

var rulesColumns = [
  { label: "Antecedent", field: "antecedent", type: "string" },
  { label: "Consequent", field: "consequent", type: "string" },
  { label: "Confidence", field: "confidence", type: "number" },
  { label: "Support", field: "support", type: "number" },
  { label: "Completeness", field: "completeness", type: "number" },
];

interface RulesFormProps {
  contextLevel: string;
  userIndex: string;
  temporalWindow: string;
  minSupport: string;
  minConfidence: string;
  feature: string;
  gapsFlag: boolean;
  aged: boolean;
}

interface RulesFormErrorProps {
  contextLevel: boolean;
  userIndex: boolean;
  temporalWindow: boolean;
  minSupport: boolean;
  minConfidence: boolean;
  feature: boolean;
}

function RulesForm(props: TabFormProps) {
  const { dataset, getApiResult, expanded } = props;
  const [formData, setFormData] = useState<RulesFormProps>({
    contextLevel: "0",
    userIndex: "0",
    temporalWindow: "3",
    minSupport: "0.05",
    minConfidence: "0.8",
    feature: "ZL",
    gapsFlag: false,
    aged: true,
  });
  const [formError, setFormError] = useState<RulesFormErrorProps>({
    contextLevel: false,
    userIndex: false,
    temporalWindow: false,
    minSupport: false,
    minConfidence: false,
    feature: false,
  });

  var gridSize = expanded ? 4 : 2;

  const validateForm = (newFormData: RulesFormProps) => {
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
    const checkMC =
      isNaN(parseInt(newFormData.minConfidence)) ||
      Number(newFormData.minConfidence) <= 0 ||
      Number(newFormData.minConfidence) >= 1;
    const checkF = newFormData.feature === "";

    setFormError({
      contextLevel: checkCL,
      userIndex: checkUI,
      temporalWindow: checkTW,
      minSupport: checkMS,
      minConfidence: checkMC,
      feature: checkF,
    });
  };

  const getFrequentItemsets = () => {
    // If one input is wrong, return
    if (Object.values(formError).includes(true)) return;

    let prepareData = (data: any) =>
      data.map((item: any) => ({
        ...item,
        antecedent: item.antecedent.map((ant: any) => ant.fullName).join(", "),
        consequent: item.consequent.fullName,
      }));

    const formDataAsNumber = {
      ...formData,
      contextLevel: Number(formData.contextLevel),
      userIndex: Number(formData.userIndex),
      temporalWindow: Number(formData.temporalWindow),
      minSupport: Number(formData.minSupport),
      minConfidence: Number(formData.minConfidence),
    };

    getApiResult({
      apiCallUrl: API_CALLS.getRules,
      apiParams: formDataAsNumber,
      columns: rulesColumns,
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
            name="temporalWindow"
            label="Temporal window"
            type="number"
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
            name="minSupport"
            label="Minimum support"
            type="number"
            value={formData.minSupport}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.minSupport}
            helperText={formError.minSupport ? "Value between 0 and 1" : ""}
          />
        </Grid>
        <Grid item xs={gridSize}>
          <TextField
            id="min-confidence-input"
            name="minConfidence"
            label="Minimum confidence"
            type="number"
            value={formData.minConfidence}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.minConfidence}
            helperText={formError.minConfidence ? "Value between 0 and 1" : ""}
          />
        </Grid>
        <Grid item xs={gridSize}>
          <TextField
            id="feature-input"
            name="feature"
            label="Feature"
            type="string"
            value={formData.feature}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            error={formError.feature}
            helperText={formError.feature ? "Value in list" : ""}
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
                name="aged"
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
            Get Rules
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RulesForm;
