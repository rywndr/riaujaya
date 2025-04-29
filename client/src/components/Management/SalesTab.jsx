import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus,
  Archive,
  ArchiveRestore
} from 'lucide-react';
import * as apiService from '../../services/apiService';
import CommonUI from '../UI/CommonUI';
import SearchInput from '../UI/SearchInput';
import ActionButton from '../UI/ActionButton';
import CashierForm from './Forms/CashierForm';
import CashierList from './Cashiers/CashierList';
import Pagination from '../UI/Pagination';

const SalesTab = ({ cashiers: initialCashiers, colors, reloadCashiers }) => {
  // state for managing cashiers
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCashier, setEditingCashier] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [allCashiers, setAllCashiers] = useState(initialCashiers || []);
  
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // initialize cashiers from props
  useEffect(() => {
    if (initialCashiers && !showArchived) {
      setAllCashiers(initialCashiers);
    }
  }, [initialCashiers]);

  // fetch all cashiers including archived ones when needed
  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        setIsSubmitting(true);
        const data = await apiService.getCashiers(showArchived);
        setAllCashiers(data);
      } catch (err) {
        console.error('Error fetching cashiers:', err);
        setOperationStatus({ type: 'error', text: 'Failed to load cashiers' });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    // only fetch if showArchived is true (to see archived cashiers)
    // or if it was true and now toggling back to false
    if (showArchived || allCashiers.some(c => c.deleted_at)) {
      fetchCashiers();
    }
  }, [showArchived]);

  // filter cashiers based on search term
  const filteredCashiers = allCashiers.filter(cashier => 
    cashier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // calculate pagination values
  const totalCashiers = filteredCashiers.length;
  const totalPages = Math.max(1, Math.ceil(totalCashiers / itemsPerPage));
  
  // ensure current page is valid after filtering
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  // get current page cashiers
  const indexOfLastCashier = currentPage * itemsPerPage;
  const indexOfFirstCashier = indexOfLastCashier - itemsPerPage;
  const currentCashiers = filteredCashiers.slice(indexOfFirstCashier, indexOfLastCashier);
  
  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      const data = await apiService.getCashiers(showArchived);
      setAllCashiers(data);
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
      const data = await apiService.getCashiers(showArchived);
      setAllCashiers(data);
      setEditingCashier(null);
    } catch (err) {
      console.error('error updating cashier:', err);
      setOperationStatus({ type: 'error', text: 'failed to update cashier' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle delete cashier (archive)
  const handleDeleteCashier = async (id) => {
    if (!window.confirm('Are you sure you want to archive this cashier?')) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteCashier(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Cashier archived successfully' });
      
      // reload cashiers
      const data = await apiService.getCashiers(showArchived);
      setAllCashiers(data);
    } catch (err) {
      console.error('Error archiving cashier:', err);
      setOperationStatus({ type: 'error', text: 'Failed to archive cashier' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };
  
  // handle restore cashier
  const handleRestoreCashier = async (id) => {
    try {
      setIsSubmitting(true);
      await apiService.restoreCashier(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Cashier restored successfully' });
      
      // reload cashiers
      const data = await apiService.getCashiers(showArchived);
      setAllCashiers(data);
    } catch (err) {
      console.error('Error restoring cashier:', err);
      setOperationStatus({ type: 'error', text: 'Failed to restore cashier' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingCashier(null);
  };
  
  // toggle showing archived cashiers
  const toggleShowArchived = () => {
    setShowArchived(prev => !prev);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* header */}
      <div className={`${colors.cardBg} rounded-lg ${colors.shadow} p-6 mb-6`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className={`text-2xl font-bold ${colors.textColor}`}>
                <Users className="inline-block mr-2" />
                Sales Team Members
              </h2>
              <p className={`${colors.textMuted} mt-1`}>
                manage your cashiers and sales team
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="search cashiers..."
                colors={colors}
                className="flex-1 sm:max-w-xs"
              />
              
              <div className="flex flex-row gap-2">
                <ActionButton
                  onClick={handleShowAddForm}
                  icon={UserPlus}
                  label="Add Cashier"
                  colors={colors}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                />
                
                <ActionButton
                  onClick={toggleShowArchived}
                  icon={showArchived ? ArchiveRestore : Archive}
                  label={showArchived ? "Hide Archived" : "Show Archived"}
                  variant="outline"
                  colors={colors}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                />
              </div>
            </div>
          </div>
          
          {/* achived status */}
          {showArchived && (
            <div className={`p-2 rounded ${colors.cardBg} border border-amber-400 text-center text-sm ${colors.textMuted}`}>
              <Archive className="inline-block h-4 w-4 mr-1" />
              Showing active and archived cashiers. Some actions are limited for archived items.
            </div>
          )}
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
        cashiers={currentCashiers}
        totalCount={totalCashiers}
        colors={colors}
        onEdit={handleEdit}
        onDelete={handleDeleteCashier}
        onRestore={handleRestoreCashier}
        isLoading={isSubmitting}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onAddCashier={handleShowAddForm}
      />
      
      {/* pagination controls */}
      {totalCashiers > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalCashiers}
          colors={colors}
          itemLabel="Cashiers"
        />
      )}
    </div>
  );
};

export default SalesTab;
