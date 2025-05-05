import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import POSSystem from '../POSSystem';
import { useOutletContext } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useTransactionState } from '../../../hooks/useTransactionState';
import { useFetchData } from '../../../hooks/useFetchData';
import * as apiService from '../../../services/apiService';
import * as receiptUtils from '../../../utils/receiptUtils';

// mock all the hooks and imported modules
vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn()
}));

vi.mock('../../../hooks/useCart', () => ({
  useCart: vi.fn()
}));

vi.mock('../../../hooks/useTransactionState', () => ({
  useTransactionState: vi.fn()
}));

vi.mock('../../../hooks/useFetchData', () => ({
  useFetchData: vi.fn()
}));

vi.mock('../../../services/apiService', () => ({
  createTransaction: vi.fn()
}));

vi.mock('../../../utils/receiptUtils', () => ({
  printReceipt: vi.fn(),
  prepareReceiptData: vi.fn()
}));

// mock window.alert
const originalAlert = window.alert;
let alertMock;

describe('POSSystem component transaction flow', () => {
  beforeEach(() => {
    // setup useOutletContext mock
    useOutletContext.mockReturnValue({
      colors: {
        pageBg: 'bg-gray-100',
        cardBg: 'bg-white',
        textColor: 'text-gray-800',
        buttonPrimary: 'bg-blue-500 text-white',
        buttonSecondary: 'bg-gray-200',
        shadowLg: 'shadow-lg'
      }
    });

    // setup useCart mock with empty cart by default
    useCart.mockReturnValue({
      cart: [],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: vi.fn()
      },
      subtotal: 0,
      totalDiscount: 0,
      total: 0
    });

    // setup useTransactionState mock
    useTransactionState.mockReturnValue({
      selectedCashierId: '',
      setSelectedCashierId: vi.fn(),
      customerName: '',
      setCustomerName: vi.fn(),
      customerPhone: '',
      setCustomerPhone: vi.fn(),
      notes: '',
      setNotes: vi.fn(),
      setSalesNumber: vi.fn(),
      setPrintedInfo: vi.fn(),
      showReceipt: false,
      setShowReceipt: vi.fn(),
      currentTransaction: null,
      setCurrentTransaction: vi.fn(),
      resetTransactionState: vi.fn()
    });

    // setup useFetchData mock
    useFetchData.mockReturnValue({
      products: [
        { id: 1, name: 'Product 1', code: 'P1', unit_price: 10000 },
        { id: 2, name: 'Product 2', code: 'P2', unit_price: 20000 }
      ],
      cashiers: [
        { id: 1, name: 'Cashier 1' },
        { id: 2, name: 'Cashier 2' }
      ],
      isLoading: false,
      error: null
    });

    // mock window.alert
    alertMock = vi.fn();
    window.alert = alertMock;

    // mock utility function in window scope for phone number formatting
    window.getCustomerFullPhone = vi.fn().mockReturnValue('+6281234567890');

    // mock prepareReceiptData
    receiptUtils.prepareReceiptData.mockReturnValue({
      receiptTransaction: {
        id: '123',
        sales_number: '1234/RJC/05/2025',
        transaction_date: '2025-05-05T12:00:00.000Z',
        customer_name: 'Test Customer',
        cashier_name: 'Cashier 1'
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.alert = originalAlert;
  });

  test('should disable process button when cart is empty', () => { // Renamed test
    // set up POSSystem with an empty cart
    useCart.mockReturnValue({
      cart: [],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: vi.fn()
      },
      subtotal: 0,
      totalDiscount: 0,
      total: 0
    });

    render(<POSSystem />);
    
    const processButton = screen.getByRole('button', { name: /Process Transaction/i });
    
    expect(processButton).toBeDisabled();
  });

  test('should show an alert when no cashier is selected but cart has items', async () => {
    // update useCart mock to return a non-empty cart
    useCart.mockReturnValue({
      cart: [{ 
        product_id: 1, 
        product_name: 'Product 1', 
        product_code: 'P1', 
        unit_price: 10000, 
        quantity: 1, 
        discount_percentage: 0, 
        total_price: 10000 
      }],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: vi.fn()
      },
      subtotal: 10000,
      totalDiscount: 0,
      total: 10000
    });
    
    render(<POSSystem />);
    
    // find and click the Process Transaction button
    const processButton = screen.getByText('Process Transaction');
    fireEvent.click(processButton);
    
    // check that alert was called with the correct message
    expect(alertMock).toHaveBeenCalledWith('Pilih nama kasir');
  });

  test('should process transaction successfully with minimal info', async () => {
    // setup for successful transaction flow
    const mockSetShowReceipt = vi.fn();
    const mockSetCurrentTransaction = vi.fn();
    const mockClearCart = vi.fn();
    
    // update useCart mock to return a non-empty cart
    useCart.mockReturnValue({
      cart: [{ 
        product_id: 1, 
        product_name: 'Product 1', 
        product_code: 'P1', 
        unit_price: 10000, 
        quantity: 1, 
        discount_percentage: 0, 
        total_price: 10000 
      }],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: mockClearCart
      },
      subtotal: 10000,
      totalDiscount: 0,
      total: 10000
    });
    
    // setup transaction state with a selected cashier
    useTransactionState.mockReturnValue({
      selectedCashierId: '1',
      setSelectedCashierId: vi.fn(),
      customerName: '',  // empty customer name should use default
      setCustomerName: vi.fn(),
      customerPhone: '',  // empty phone number is valid
      setCustomerPhone: vi.fn(),
      notes: '',
      setNotes: vi.fn(),
      setSalesNumber: vi.fn(),
      setPrintedInfo: vi.fn(),
      showReceipt: false,
      setShowReceipt: mockSetShowReceipt,
      currentTransaction: null,
      setCurrentTransaction: mockSetCurrentTransaction,
      resetTransactionState: vi.fn()
    });
    
    // mock successful API response
    apiService.createTransaction.mockResolvedValue({
      transaction: {
        id: '123',
        created_at: '2025-05-05T12:00:00.000Z'
      }
    });
    
    render(<POSSystem />);
    
    // find and click the Process Transaction button
    const processButton = screen.getByText('Process Transaction');
    fireEvent.click(processButton);
    
    // wait for the async operation to complete
    await waitFor(() => {
      expect(apiService.createTransaction).toHaveBeenCalled();
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockSetShowReceipt).toHaveBeenCalledWith(true);
      expect(mockSetCurrentTransaction).toHaveBeenCalled();
      expect(alertMock).not.toHaveBeenCalled(); // no errors should be shown
    });
    
    // verify that the API was called with appropriate data
    const apiCallArg = apiService.createTransaction.mock.calls[0][0];
    expect(apiCallArg).toHaveProperty('cashier_id', 1); // should be converted to int
    expect(apiCallArg).toHaveProperty('customer_name', 'KONSUMEN BENGKEL'); // default value
    expect(apiCallArg).toHaveProperty('customer_phone', ''); // empty is valid
  });

  test('should handle Indonesian phone number formatting correctly', async () => {
    const mockSetShowReceipt = vi.fn();
    const mockSetCurrentTransaction = vi.fn();
    
    // update useCart mock to return a non-empty cart
    useCart.mockReturnValue({
      cart: [{ 
        product_id: 1, 
        product_name: 'Product 1', 
        product_code: 'P1', 
        unit_price: 10000, 
        quantity: 1, 
        discount_percentage: 0, 
        total_price: 10000 
      }],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: vi.fn()
      },
      subtotal: 10000,
      totalDiscount: 0,
      total: 10000
    });
    
    // setup transaction state with a selected cashier and phone number
    useTransactionState.mockReturnValue({
      selectedCashierId: '1',
      setSelectedCashierId: vi.fn(),
      customerName: 'Test Customer',
      setCustomerName: vi.fn(),
      customerPhone: '81234567890', // valid Indonesian phone number without country code
      setCustomerPhone: vi.fn(),
      notes: 'Test notes',
      setNotes: vi.fn(),
      setSalesNumber: vi.fn(),
      setPrintedInfo: vi.fn(),
      showReceipt: false,
      setShowReceipt: mockSetShowReceipt,
      currentTransaction: null,
      setCurrentTransaction: mockSetCurrentTransaction,
      resetTransactionState: vi.fn()
    });
    
    // mock successful API response
    apiService.createTransaction.mockResolvedValue({
      transaction: {
        id: '123',
        created_at: '2025-05-05T12:00:00.000Z'
      }
    });
    
    render(<POSSystem />);
    
    // find and click the Process Transaction button
    const processButton = screen.getByText('Process Transaction');
    fireEvent.click(processButton);
    
    // wait for the async operation to complete
    await waitFor(() => {
      expect(apiService.createTransaction).toHaveBeenCalled();
      expect(window.getCustomerFullPhone).toHaveBeenCalled();
      expect(mockSetShowReceipt).toHaveBeenCalledWith(true);
      expect(mockSetCurrentTransaction).toHaveBeenCalled();
    });
    
    // verify that the API was called with appropriate formatted phone data
    const apiCallArg = apiService.createTransaction.mock.calls[0][0];
    expect(apiCallArg).toHaveProperty('customer_phone', '+6281234567890'); // should use the formatted version
  });

  test('should handle API error during transaction processing', async () => {
    // update useCart mock to return a non-empty cart
    useCart.mockReturnValue({
      cart: [{ 
        product_id: 1, 
        product_name: 'Product 1', 
        product_code: 'P1', 
        unit_price: 10000, 
        quantity: 1, 
        discount_percentage: 0, 
        total_price: 10000 
      }],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: vi.fn()
      },
      subtotal: 10000,
      totalDiscount: 0,
      total: 10000
    });
    
    // setup transaction state with a selected cashier
    useTransactionState.mockReturnValue({
      selectedCashierId: '1',
      setSelectedCashierId: vi.fn(),
      customerName: 'Test Customer',
      setCustomerName: vi.fn(),
      customerPhone: '81234567890',
      setCustomerPhone: vi.fn(),
      notes: 'Test notes',
      setNotes: vi.fn(),
      setSalesNumber: vi.fn(),
      setPrintedInfo: vi.fn(),
      showReceipt: false,
      setShowReceipt: vi.fn(),
      currentTransaction: null,
      setCurrentTransaction: vi.fn(),
      resetTransactionState: vi.fn()
    });
    
    // mock API error
    apiService.createTransaction.mockRejectedValue(new Error('Network error'));
    
    render(<POSSystem />);
    
    // find and click the Process Transaction button
    const processButton = screen.getByText('Process Transaction');
    fireEvent.click(processButton);
    
    // wait for the async operation to complete and error to be caught
    await waitFor(() => {
      expect(apiService.createTransaction).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith('transaction error: Network error');
    });
  });

  test('should reset transaction correctly', () => {
    const mockResetTransactionState = vi.fn();
    const mockClearCart = vi.fn();
    
    // setup for reset functionality
    useTransactionState.mockReturnValue({
      selectedCashierId: '1',
      setSelectedCashierId: vi.fn(),
      customerName: 'Test Customer',
      setCustomerName: vi.fn(),
      customerPhone: '81234567890',
      setCustomerPhone: vi.fn(),
      notes: 'Test notes',
      setNotes: vi.fn(),
      setSalesNumber: vi.fn(),
      setPrintedInfo: vi.fn(),
      showReceipt: false,
      setShowReceipt: vi.fn(),
      currentTransaction: null,
      setCurrentTransaction: vi.fn(),
      resetTransactionState: mockResetTransactionState
    });
    
    useCart.mockReturnValue({
      cart: [{ 
        product_id: 1, 
        product_name: 'Product 1', 
        product_code: 'P1', 
        unit_price: 10000, 
        quantity: 1, 
        discount_percentage: 0, 
        total_price: 10000 
      }],
      cartFunctions: {
        addToCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        updateDiscount: vi.fn(),
        clearCart: mockClearCart
      },
      subtotal: 10000,
      totalDiscount: 0,
      total: 10000
    });
    
    render(<POSSystem />);
    
    // find and click the Reset button
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    // check that the reset functions were called
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockResetTransactionState).toHaveBeenCalled();
  });
});