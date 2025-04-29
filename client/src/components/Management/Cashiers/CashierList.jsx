import React from 'react';
import { 
  Users, 
  Search, 
  Edit2, 
  Trash,
  AlertCircle,
  RefreshCw,
  Archive 
} from 'lucide-react';

const CashierList = ({ 
  cashiers, 
  totalCount, 
  colors, 
  onEdit, 
  onDelete,
  onRestore, 
  isLoading, 
  searchTerm, 
  onClearSearch, 
  onAddCashier 
}) => {
  return (
    <div className={`${colors.cardBg} rounded-lg ${colors.shadowLg} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y ${colors.divider}">
          <thead className={`${colors.tableHeaderBg} ${colors.tableText}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${colors.divider} ${colors.textColor}`}>
            {cashiers.length > 0 ? (
              cashiers.map((cashier) => {
                const isDeleted = cashier.deleted_at !== null;
                
                return (
                  <tr key={cashier.id} className={`${colors.tableHover} ${isDeleted ? 'opacity-70' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className={`h-5 w-5 mr-2 ${colors.textMuted}`} />
                        <span>{cashier.name}</span>
                        {cashier.has_transactions && (
                          <div className="ml-2 inline-flex items-center text-xs">
                            <AlertCircle size={14} className="text-amber-500 mr-1" />
                            <span className="text-amber-500">Has transactions</span>
                          </div>
                        )}
                        {isDeleted && (
                          <div className="ml-2 inline-flex items-center text-xs">
                            <Archive size={14} className="text-red-500 mr-1" />
                            <span className="text-red-500">Archived</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(cashier.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      {!isDeleted ? (
                        <>
                          <button
                            className={`${colors.buttonOutline} p-2 rounded-lg inline-flex items-center justify-center ${colors.transition}`}
                            onClick={() => onEdit(cashier)}
                            disabled={isLoading}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg inline-flex items-center justify-center"
                            onClick={() => onDelete(cashier.id)}
                            disabled={isLoading}
                            title="Archive cashier"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-lg inline-flex items-center justify-center"
                          onClick={() => onRestore(cashier.id)}
                          disabled={isLoading}
                          title="Restore cashier"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center">
                  {searchTerm ? (
                    <div>
                      <Search className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
                      <p>no cashiers found matching "{searchTerm}"</p>
                      <button 
                        className={`${colors.buttonOutline} mt-2 px-4 py-1 rounded-lg text-sm ${colors.transition}`}
                        onClick={onClearSearch}
                      >
                        clear search
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Users className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
                      <p>no cashiers found</p>
                      <button 
                        className={`${colors.buttonPrimary} mt-2 px-4 py-1 rounded-lg text-sm ${colors.transition}`}
                        onClick={onAddCashier}
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
      
      <div className={`px-6 py-4 border-t ${colors.border}`}>
        <p className={`text-sm ${colors.textMuted}`}>
          showing {cashiers.length} of {totalCount} cashiers
        </p>
      </div>
    </div>
  );
};

export default CashierList;
