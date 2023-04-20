import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

function FileUpload() {
  const [value, setValue] = useState<File | null>(null);

  const handleChange = (newValue: File | null) => {
    setValue(newValue);
  };

  return <MuiFileInput value={value} onChange={handleChange} placeholder="Add new dataset" />;
}

export default FileUpload;
