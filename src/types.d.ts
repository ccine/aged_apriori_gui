export interface TabFormProps {
  dataset: string;
  setResult: (res: ResultType) => void;
  setLoading: (x: boolean) => void;
  setError: (x: boolean) => void;
  expanded: boolean;
}

export interface ResultType {
  columns: {
    label: string;
    field: string;
    type: string;
  }[];
  data: { [x: string]: string | number }[];
}
