export interface getApiResultProps {
  apiCallUrl: (data: string) => string;
  apiParams: any;
  columns: ResultType["columns"];
  prepareData: (rawData: any) => ResultType["data"];
}

export interface DatasetInfo {
  name: string;
  userList: string[];
}

export interface TabFormProps {
  dataset: DatasetInfo;
  getApiResult: (props: getApiResultProps) => void;
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