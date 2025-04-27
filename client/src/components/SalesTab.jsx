import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Edit2, 
  Trash,
  X,
  Check,
  AlertTriangle,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import * as apiService from '../services/apiService';

const SalesTab = ({ cashiers, colors, reloadCashiers }) => {
  // state for managing cashiers
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCashier, setEditingCashier] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);

  // reset form
  const resetForm = () => {
    setFormData({ name: '' });
    setFormErrors({});
    setEditingCashier(null);
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  // handle showing add form
  const handleShowAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  // handle starting edit mode
  const handleEdit = (cashier) => {
    setEditingCashier(cashier.id);
    setFormData({ name: cashier.name });
    setFormErrors({});
    setShowAddForm(false);
  };

  // form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // handle form submission for adding
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await apiService.createCashier(formData);
      
      // show success message
      setOperationStatus({ type: 'success', message: 'Cashier added successfully' });
      
      // reload cashiers and reset form
      await reloadCashiers();
      resetForm();
    } catch (err) {
      console.error('Error adding cashier:', err);
      setOperationStatus({ type: 'error', message: 'Failed to add cashier' });
    } finally {
      setIsSubmitting(false);
      
      // clear status message after 3 seconds
      setTimeout(() => setOperationStatus(null), 3000);
    }
  };

  // handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await apiService.updateCashier(editingCashier, formData);
      
      // show success message
      setOperationStatus({ type: 'success', message: 'Cashier updated successfully' });
      
      // reload cashiers and reset form
      await reloadCashiers();
      resetForm();
    } catch (err) {
      console.error('Error updating cashier:', err);
      setOperationStatus({ type: 'error', message: 'Failed to update cashier' });
    } finally {
      setIsSubmitting(false);
      
      // clear status message after 3 seconds
      setTimeout(() => setOperationStatus(null), 3000);
    }
  };

  // handle delete cashier
  const handleDelete = async (id) => {
    if (!window.confirm('are you sure you want to delete this cashier?')) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteCashier(id);
      
      // show success message
      setOperationStatus({ type: 'success', message: 'cashier deleted successfully' });
      
      // reload cashiers
      await reloadCashiers();
    } catch (err) {
      console.error('error deleting cashier:', err);
      setOperationStatus({ type: 'error', message: 'failed to delete cashier' });
    } finally {
      setIsSubmitting(false);
      
      // clear status message after 3 seconds
      setTimeout(() => setOperationStatus(null), 3000);
    }
  };

  // filter cashiers based on search term
  const filteredCashiers = cashiers.filter(cashier => 
    cashier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* header with actions */}
      <div className={`${colors.cardBg} rounded-lg ${colors.shadow} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${colors.textColor}`}>
              <Users className="inline-block mr-2" />
              Sales Team Members
            </h2>
            <p className={`${colors.textMuted} mt-1`}>
              Manage your cashiers and sales team
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={colors.textMuted} />
              </div>
                <input
                  type="text"
                  placeholder="search cashiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                />
            </div>
            
            <button
              className={`${colors.buttonPrimary} flex items-center justify-center py-2 px-4 rounded-lg ${colors.transition}`}
              onClick={handleShowAddForm}
              disabled={isSubmitting}
            >
              <UserPlus size={18} className="mr-2" />
              Add Cashier
            </button>
          </div>
        </div>
      </div>
      
      {/* operation status message */}
      {operationStatus && (
        <div className={`rounded-lg mb-6 p-4 flex items-center ${
          operationStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {operationStatus.type === 'success' ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span>{operationStatus.message}</span>
        </div>
      )}
      
      {/* add form */}
      {showAddForm && (
        <div className={`${colors.cardBg} rounded-lg ${colors.shadow} p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${colors.textColor}`}>Add New Cashier</h3>
            <button 
              className={`${colors.buttonSecondary} p-2 rounded-full ${colors.transition}`}
              onClick={() => setShowAddForm(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleAddSubmit}>
            <div className="mb-4">
              <label className={`block mb-2 ${colors.textColor}`}>
                Cashier Name <span className={colors.error}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                placeholder="Enter cashier name"
              />
              {formErrors.name && (
                <p className={`${colors.error} text-sm mt-1`}>{formErrors.name}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`${colors.buttonOutline} px-4 py-2 rounded-lg ${colors.transition}`}
                onClick={() => setShowAddForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center ${colors.transition}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                Save Cashier
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* edit form */}
      {editingCashier && (
        <div className={`${colors.cardBg} rounded-lg ${colors.shadow} p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${colors.textColor}`}>Edit Cashier</h3>
            <button 
              className={`${colors.buttonSecondary} p-2 rounded-full ${colors.transition}`}
              onClick={() => setEditingCashier(null)}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className={`block mb-2 ${colors.textColor}`}>
                Cashier Name <span className={colors.error}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                placeholder="enter cashier name"
              />
              {formErrors.name && (
                <p className={`${colors.error} text-sm mt-1`}>{formErrors.name}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`${colors.buttonOutline} px-4 py-2 rounded-lg ${colors.transition}`}
                onClick={() => setEditingCashier(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center ${colors.transition}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                Update Cashier
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* cashiers list */}
      <div className={`${colors.cardBg} rounded-lg ${colors.shadowLg} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y ${colors.divider}">
            <thead className={`${colors.tableHeaderBg} ${colors.tableText}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${colors.divider} ${colors.textColor}`}>
              {filteredCashiers.length > 0 ? (
                filteredCashiers.map((cashier) => (
                  <tr key={cashier.id} className={colors.tableHover}>
                    <td className="px-6 py-4 whitespace-nowrap">{cashier.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className={`h-5 w-5 mr-2 ${colors.textMuted}`} />
                        <span>{cashier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(cashier.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        className={`${colors.buttonOutline} p-2 rounded-lg inline-flex items-center justify-center ${colors.transition}`}
                        onClick={() => handleEdit(cashier)}
                        disabled={isSubmitting}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg inline-flex items-center justify-center"
                        onClick={() => handleDelete(cashier.id)}
                        disabled={isSubmitting}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    {searchTerm ? (
                      <div>
                        <Search className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
                        <p>No cashiers found matching "{searchTerm}"</p>
                        <button 
                          className={`${colors.buttonOutline} mt-2 px-4 py-1 rounded-lg text-sm ${colors.transition}`}
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Users className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
                        <p>No cashiers found</p>
                        <button 
                          className={`${colors.buttonPrimary} mt-2 px-4 py-1 rounded-lg text-sm ${colors.transition}`}
                          onClick={handleShowAddForm}
                        >
                          add your first cashier
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* pagination can be added here in the future */}
        <div className={`px-6 py-4 border-t ${colors.border}`}>
          <p className={`text-sm ${colors.textMuted}`}>
            Showing {filteredCashiers.length} of {cashiers.length} cashiers
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesTab;
