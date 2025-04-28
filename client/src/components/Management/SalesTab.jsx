import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus
} from 'lucide-react';
import * as apiService from '../../services/apiService';
import CommonUI from '../UI/CommonUI';
import SearchInput from '../UI/SearchInput';
import ActionButton from '../UI/ActionButton';
import CashierForm from './Forms/CashierForm';
import CashierList from './Cashiers/CashierList';

const SalesTab = ({ cashiers, colors, reloadCashiers }) => {
  // state for managing cashiers
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCashier, setEditingCashier] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // filter cashiers based on search term
  const filteredCashiers = cashiers.filter(cashier => 
    cashier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // clear operation status after timeout
  const clearOperationStatus = () => {
    setTimeout(() => setOperationStatus(null), 3000);
  };

  // handle showing add form
  const handleShowAddForm = () => {
    setEditingCashier(null);
    setShowAddForm(true);
  };

  // handle starting edit mode
  const handleEdit = (cashier) => {
    setEditingCashier(cashier);
    setShowAddForm(false);
  };

  // handle form submission for adding
  const handleAddCashier = async (cashierData) => {
    try {
      setIsSubmitting(true);
      await apiService.createCashier(cashierData);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Cashier added successfully' });
      
      // reload cashiers and reset form
      await reloadCashiers();
      setShowAddForm(false);
    } catch (err) {
      console.error('error adding cashier:', err);
      setOperationStatus({ type: 'error', text: 'Failed to add cashier' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle form submission for editing
  const handleUpdateCashier = async (id, cashierData) => {
    try {
      setIsSubmitting(true);
      await apiService.updateCashier(id, cashierData);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'cashier updated successfully' });
      
      // reload cashiers and reset form
      await reloadCashiers();
      setEditingCashier(null);
    } catch (err) {
      console.error('error updating cashier:', err);
      setOperationStatus({ type: 'error', text: 'failed to update cashier' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle delete cashier
  const handleDeleteCashier = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cashier?')) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteCashier(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Cashier deleted successfully' });
      
      // reload cashiers
      await reloadCashiers();
    } catch (err) {
      console.error('Error deleting cashier:', err);
      setOperationStatus({ type: 'error', text: 'Failed to delete cashier' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingCashier(null);
  };

  return (
    <div>
      {/* header */}
      <div className={`${colors.cardBg} rounded-lg ${colors.shadow} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${colors.textColor}`}>
              <Users className="inline-block mr-2" />
              Sales Team Members
            </h2>
            <p className={`${colors.textMuted} mt-1`}>
              manage your cashiers and sales team
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search cashiers..."
              colors={colors}
            />
            
            <ActionButton
              onClick={handleShowAddForm}
              icon={UserPlus}
              label="Add Cashier"
              colors={colors}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      
      {/* operation status message */}
      <CommonUI.StatusMessage message={operationStatus} />
      
      {/* add form */}
      {showAddForm && (
        <CashierForm
          colors={colors}
          onSubmit={handleAddCashier}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
          formTitle="Add New Cashier"
        />
      )}
      
      {/* edit form */}
      {editingCashier && (
        <CashierForm
          colors={colors}
          onSubmit={(data) => handleUpdateCashier(editingCashier.id, data)}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
          formTitle="Edit Cashier"
          initialData={editingCashier}
        />
      )}
      
      {/* cashiers list */}
      <CashierList
        cashiers={filteredCashiers}
        totalCount={cashiers.length}
        colors={colors}
        onEdit={handleEdit}
        onDelete={handleDeleteCashier}
        isLoading={isSubmitting}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onAddCashier={handleShowAddForm}
      />
    </div>
  );
};

export default SalesTab;
