import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
} from "@mui/material";
import FrequentItemsetForm from "./FrequentItemsetForm";
import RulesForm from "./RulesForm";
import ValidationForm from "./ValidationForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`function-tabpanel-${index}`}
      aria-labelledby={`function    -tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `function-tab-${index}`,
    "aria-controls": `function-tabpanel-${index}`,
  };
}

function InputForm(props: {
  datasets: { name: string; numberOfUsers: number }[];
}) {
  const [chosenDataset, setChosenDataset] = useState(props.datasets[0].name);
  const [value, setValue] = useState(0);

  return (
    <div>
      <Box>
        <FormControl fullWidth>
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
            {props.datasets.map((item, index) => (
              <MenuItem value={item.name} key={index}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/*<Button variant="text" color="primary" size="large">
          Add dataset
            </Button>*/}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs
          value={value}
          onChange={(event: React.SyntheticEvent, newValue: number) =>
            setValue(newValue)
          }
          aria-label="Function Tab"
        >
          <Tab label="Frequent Itemsets" {...a11yProps(0)} />
          <Tab label="Rules" {...a11yProps(1)} />
          <Tab label="Validation" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <FrequentItemsetForm dataset={chosenDataset} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RulesForm dataset={chosenDataset} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ValidationForm dataset={chosenDataset} />
      </TabPanel>
    </div>
  );
}

export default InputForm;
