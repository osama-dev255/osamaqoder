import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle API responses
apiClient.interceptors.response.use(
  (response) => {
    // Ensure we're returning the actual data from the response
    return response.data || response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
);

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return response;
  } catch (error: unknown) {
    console.error('Health check error:', error);
    throw error;
  }
};

// Get spreadsheet metadata
export const getSpreadsheetMetadata = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.METADATA);
    return response;
  } catch (error: unknown) {
    console.error('Metadata fetch error:', error);
    throw error;
  }
};

// Get all sheets data
export const getAllSheetsData = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ALL_SHEETS);
    return response;
  } catch (error: unknown) {
    console.error('All sheets data fetch error:', error);
    throw error;
  }
};

// Get specific sheet data
export const getSheetData = async (sheetName: string, range?: string) => {
  try {
    const url = range 
      ? API_ENDPOINTS.SHEET_RANGE(sheetName, range)
      : API_ENDPOINTS.SHEET_DATA(sheetName);
    const response = await apiClient.get(url);
    return response;
  } catch (error: unknown) {
    console.error(`Sheet data fetch error for ${sheetName}:`, error);
    throw error;
  }
};

// Append data to sheet
export const appendSheetData = async (sheetName: string, values: unknown[][]) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.APPEND_DATA(sheetName), { values });
    return response;
  } catch (error: unknown) {
    console.error(`Append data error for ${sheetName}:`, error);
    throw error;
  }
};

// Update sheet range
export const updateSheetRange = async (sheetName: string, range: string, values: unknown[][]) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.UPDATE_RANGE(sheetName, range), { values });
    return response;
  } catch (error: unknown) {
    console.error(`Update range error for ${sheetName}:`, error);
    throw error;
  }
};

// Clear sheet data
export const clearSheetData = async (sheetName: string, range?: string) => {
  try {
    const params = range ? { range } : {};
    const response = await apiClient.delete(API_ENDPOINTS.CLEAR_SHEET(sheetName), { params });
    return response;
  } catch (error: unknown) {
    console.error(`Clear sheet data error for ${sheetName}:`, error);
    throw error;
  }
};

// Update inventory quantities for specific products
export const updateInventoryQuantities = async (updates: { productName: string; quantityChange: number }[]) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.SHEETS}/inventory/update-quantities`, { updates });
    return response;
  } catch (error: unknown) {
    console.error('Inventory update error:', error);
    throw error;
  }
};

// Add stock through purchase transactions
export const addStockThroughPurchases = async (purchases: { productName: string; quantity: number; cost: number }[]) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.SHEETS}/purchases/add-stock`, { purchases });
    return response;
  } catch (error: unknown) {
    console.error('Purchase stock addition error:', error);
    throw error;
  }
};

// Rename a sheet
export const renameSheet = async (oldName: string, newName: string) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.SHEETS}/rename`, { oldName, newName });
    return response;
  } catch (error: unknown) {
    console.error('Sheet rename error:', error);
    throw error;
  }
};

export default {
  healthCheck,
  getSpreadsheetMetadata,
  getAllSheetsData,
  getSheetData,
  appendSheetData,
  updateSheetRange,
  clearSheetData,
  updateInventoryQuantities,
  addStockThroughPurchases,
};
