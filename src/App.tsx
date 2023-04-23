import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddDataset from "./pages/AddDataset";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adddataset" element={<AddDataset />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
