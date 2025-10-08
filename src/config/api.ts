// API configuration for Netlify deployment
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
                    (import.meta.env.MODE === 'production' 
                      ? 'https://google-sheets-rest-api-production.up.railway.app'
                      : 'http://localhost:3000');

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  SHEETS: `${API_BASE_URL}/api/v1/sheets`,
  METADATA: `${API_BASE_URL}/api/v1/sheets/metadata`,
  ALL_SHEETS: `${API_BASE_URL}/api/v1/sheets/all`,
  SHEET_DATA: (sheetName: string) => `${API_BASE_URL}/api/v1/sheets/${sheetName}`,
  SHEET_RANGE: (sheetName: string, range: string) => `${API_BASE_URL}/api/v1/sheets/${sheetName}/range/${range}`,
  APPEND_DATA: (sheetName: string) => `${API_BASE_URL}/api/v1/sheets/${sheetName}/append`,
  UPDATE_RANGE: (sheetName: string, range: string) => `${API_BASE_URL}/api/v1/sheets/${sheetName}/range/${range}`,
  CLEAR_SHEET: (sheetName: string) => `${API_BASE_URL}/api/v1/sheets/${sheetName}/clear`,
};

export default API_BASE_URL;