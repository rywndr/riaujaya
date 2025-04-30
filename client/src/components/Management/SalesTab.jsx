import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import * as apiService from '../../services/apiService';
import SalesForm from './Forms/SalesForm';
import SalesAdapter from './Cashiers/SalesAdapter';
import ListManager from './common/ListManager';

const SalesTab = ({ cashiers: initialSalesTeam, colors }) => {
  // api methods for sales team management
  const salesApiMethods = {
    // rename all cashier functions to sales terminology
    fetchItems: apiService.getCashiers, 
    createItem: apiService.createCashier,
    updateItem: apiService.updateCashier, 
    deleteItem: apiService.deleteCashier,
    restoreItem: apiService.restoreCashier
  };
  
  // configuration for sales team list
  const salesConfig = {
    itemType: 'sales',
    searchFields: ['name'],
    headerTitle: 'Sales Team',
    headerDescription: 'manage your sales team',
    itemLabel: { 
      singular: 'sales team member', 
      plural: 'sales team members' 
    },
    searchPlaceholder: 'search team members...',
    addButtonLabel: 'Add Team Member'
  };

  return (
    <ListManager
      initialItems={initialSalesTeam}
      colors={colors}
      ItemForm={SalesForm}
      ItemList={SalesAdapter}
      headerIcon={Users}
      addButtonIcon={UserPlus}
      {...salesConfig}
      {...salesApiMethods}
    />
  );
};

export default SalesTab;
