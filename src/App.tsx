import { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import InputForm from "./components/InputForm";

function App() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState<{ name: string; numberOfUsers: number }[]>([]);

  const mdTheme = createTheme();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/aged-apriori/datasets")
      .then((response) => {
        setDatasets(response.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography sx={{ mb: 4 }} variant="h2" gutterBottom>
              Aged Apriori
            </Typography>
            {!loading && datasets.length > 0 && (
              <InputForm datasets={datasets} />
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
