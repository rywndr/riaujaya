const API_BASE_URL = import.meta.env.API_SERVER_URL || 'http://localhost:3000/api';

// fetch wrapper with error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`api error: ${error.message}`);
    throw error;
  }
};

// products api
export const getProducts = () => fetchWithErrorHandling('/products');

// cashiers api
export const getCashiers = () => fetchWithErrorHandling('/cashiers');

// transactions api
export const getTransactions = () => fetchWithErrorHandling('/transactions');

export const getTransactionById = (id) => fetchWithErrorHandling(`/transactions/${id}`);

export const createTransaction = (transactionData) => 
  fetchWithErrorHandling('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });

// health check
export const checkApiHealth = () => fetchWithErrorHandling('/health');

export default {
  getProducts,
  getCashiers,
  getTransactions,
  getTransactionById,
  createTransaction,
  checkApiHealth,
};
