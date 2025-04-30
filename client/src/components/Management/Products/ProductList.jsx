import React from 'react';
import { 
  Package, 
  Search, 
  Edit2, 
  Trash,
  Barcode,
  RefreshCw,
  Archive
} from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import ActionButton from '../../UI/ActionButton';

const ProductList = ({ 
  products,
  totalCount,
  colors,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
  searchTerm,
  onClearSearch,
  onAddProduct
}) => {
  const EmptyState = () => (
    <tr>
      <td colSpan="6" className="px-6 py-8 text-center">
        {searchTerm ? (
          <div>
            <Search 
              className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`}
              strokeWidth={1.5}
            />
            <p>no products found matching "{searchTerm}"</p>
            <button 
              className={`${colors.buttonOutline} mt-2 px-4 py-1 rounded-lg text-sm`}
              onClick={onClearSearch}
            >
              clear search
            </button>
          </div>
        ) : (
          <div>
            <Package 
              className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} 
              strokeWidth={1.5}
            />
            <p>no products found</p>
            <button 
              className={`${colors.buttonPrimary} mt-2 px-4 py-1 rounded-lg text-sm`}
              onClick={onAddProduct}
            >
              add your first product
            </button>
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className={`${colors.cardBg} rounded-lg shadow-lg overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${colors.divider}`}>
          <thead className={`${colors.tableHeaderBg} ${colors.tableText}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${colors.divider} ${colors.textColor}`}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductRow 
                  key={product.id}
                  product={product}
                  colors={colors}
                  onEdit={() => onEdit(product)}
                  onDelete={() => onDelete(product.id)}
                  onRestore={() => onRestore(product.id)}
                  isLoading={isLoading}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </div>
      
      <div className={`px-6 py-4 border-t ${colors.divider}`}>
        <p className={`text-sm ${colors.textMuted}`}>
          showing {products.length} of {totalCount} products
        </p>
      </div>
    </div>
  );
};

// product row 
const ProductRow = ({ product, colors, onEdit, onDelete, onRestore, isLoading }) => {
  const isDeleted = product.deleted_at !== null;

  return (
    <tr className={`${colors.tableHover} ${isDeleted ? 'opacity-70' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Package 
            className={`h-5 w-5 mr-2 ${colors.textMuted}`}
            strokeWidth={1.5}
          />
          <span>{product.name}</span>
          {product.has_transactions && (
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
        <div className="flex items-center">
          <Barcode 
            className={`h-5 w-5 mr-2 ${colors.textMuted}`}
            strokeWidth={1.5}
          />
          <span>{product.code}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-medium">{formatCurrency(product.unit_price)}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {new Date(product.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        {!isDeleted ? (
          <>
            <ActionButton
              onClick={onEdit}
              icon={Edit2}
              variant="icon-only"
              colors={colors}
              disabled={isLoading}
              className="p-2 rounded-lg inline-flex items-center justify-center"
              title="Edit product"
            />
            <ActionButton
              onClick={onDelete}
              icon={Trash}
              variant="icon-danger"
              disabled={isLoading}
              className="p-2 rounded-lg inline-flex items-center justify-center"
              title="Archive product"
            />
          </>
        ) : (
          <ActionButton
            onClick={onRestore}
            icon={RefreshCw}
            variant="icon-success"
            disabled={isLoading}
            className="p-2 rounded-lg inline-flex items-center justify-center"
            title="Restore product"
          />
        )}
      </td>
    </tr>
  );
};

export default ProductList;
