const API_URL = "http://127.0.0.1:8080/aged-apriori";

export const API_CALLS = {
  getDatasets: `${API_URL}/datasets`,
  sendDataset: `${API_URL}/upload-dataset`,
  getFrequentItemset: (dataset: string) =>
    `${API_URL}/frequent-itemsets/${dataset}`,
  getRules: (dataset: string) => `${API_URL}/rules/${dataset}`,
  getValidation: (dataset: string) => `${API_URL}/validation/${dataset}`,
};
