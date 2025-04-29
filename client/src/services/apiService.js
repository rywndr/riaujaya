const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL;

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

// health check
export const checkApiHealth = () => fetchWithErrorHandling('/health');

// products api
export const getProducts = () => fetchWithErrorHandling('/products');
export const createProduct = (productData) => 
  fetchWithErrorHandling('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
export const updateProduct = (id, productData) => 
  fetchWithErrorHandling(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
export const deleteProduct = (id) => 
  fetchWithErrorHandling(`/products/${id}`, {
    method: 'DELETE',
  });

// cashiers api
export const getCashiers = () => fetchWithErrorHandling('/cashiers');
export const createCashier = (cashierData) => 
  fetchWithErrorHandling('/cashiers', {
    method: 'POST',
    body: JSON.stringify(cashierData),
  });
export const updateCashier = (id, cashierData) => 
  fetchWithErrorHandling(`/cashiers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cashierData),
  });
export const deleteCashier = (id) => 
  fetchWithErrorHandling(`/cashiers/${id}`, {
    method: 'DELETE',
  });

// customers api
export const getCustomers = () => fetchWithErrorHandling('/customers');
export const createCustomer = (customerData) => 
  fetchWithErrorHandling('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
export const updateCustomer = (id, customerData) => 
  fetchWithErrorHandling(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  });
export const deleteCustomer = (id) => 
  fetchWithErrorHandling(`/customers/${id}`, {
    method: 'DELETE',
  });

// transactions api
export const getTransactions = () => fetchWithErrorHandling('/transactions');
export const getTransactionById = (id) => fetchWithErrorHandling(`/transactions/${id}`);
export const createTransaction = (transactionData) => 
  fetchWithErrorHandling('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
export const updateTransaction = (id, transactionData) => 
  fetchWithErrorHandling(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
export const deleteTransaction = (id) => 
  fetchWithErrorHandling(`/transactions/${id}`, {
    method: 'DELETE',
  });

// export all api functions
export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  getCashiers,
  createCashier,
  updateCashier,
  deleteCashier,
  
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  
  checkApiHealth,
};
