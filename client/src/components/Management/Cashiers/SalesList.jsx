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
import ActionButton from '../../UI/ActionButton';

const SalesList = ({ 
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
              cashiers.map((salesMember) => {
                const isDeleted = salesMember.deleted_at !== null;
                
                return (
                  <tr key={salesMember.id} className={`${colors.tableHover} ${isDeleted ? 'opacity-70' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users 
                          className={`h-5 w-5 mr-2 ${colors.textMuted}`} 
                          strokeWidth={1.5}
                        />
                        <span>{salesMember.name}</span>
                        {salesMember.has_transactions && (
                          <div className="relative ml-2 group">
                            <span 
                              className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"
                              aria-label="Has transactions"
                            ></span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-10">
                              Has transactions
                            </div>
                          </div>
                        )}
                        {isDeleted && (
                          <div className="ml-2 inline-flex items-center text-xs">
                            <Archive 
                              size={14} 
                              className="text-red-500 mr-1" 
                              strokeWidth={1.5}
                            />
                            <span className="text-red-500">Archived</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(salesMember.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      {!isDeleted ? (
                        <>
                          <ActionButton
                            onClick={() => onEdit(salesMember)}
                            icon={Edit2}
                            variant="icon-only"
                            colors={colors}
                            disabled={isLoading}
                            className="p-2 rounded-lg inline-flex items-center justify-center"
                            title="Edit team member"
                          />
                          <ActionButton
                            onClick={() => onDelete(salesMember.id)}
                            icon={Trash}
                            variant="icon-danger"
                            disabled={isLoading}
                            className="p-2 rounded-lg inline-flex items-center justify-center"
                            title="Archive team member"
                          />
                        </>
                      ) : (
                        <ActionButton
                          onClick={() => onRestore(salesMember.id)}
                          icon={RefreshCw}
                          variant="icon-success"
                          disabled={isLoading}
                          className="p-2 rounded-lg inline-flex items-center justify-center"
                          title="Restore team member"
                        />
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
                      <Search 
                        className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} 
                        strokeWidth={1.5}
                      />
                      <p>no team members found matching "{searchTerm}"</p>
                      <button 
                        className={`${colors.buttonOutline} mt-2 px-4 py-1 rounded-lg text-sm ${colors.transition}`}
                        onClick={onClearSearch}
                      >
                        clear search
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Users 
                        className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} 
                        strokeWidth={1.5}
                      />
                      <p>no team members found</p>
                      <button 
                        className={`${colors.buttonPrimary} mt-2 px-4 py-1 rounded-lg text-sm ${colors.transition}`}
                        onClick={onAddCashier}
                      >
                        add your first team member
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default SalesList;
