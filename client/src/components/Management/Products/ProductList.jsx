import React from 'react';
import { 
  Package, 
  Search, 
  Edit2, 
  Trash,
  Barcode 
} from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import ActionButton from '../../UI/ActionButton';

const ProductList = ({ 
  products,
  totalCount,
  colors,
  onEdit,
  onDelete,
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
            <Search className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
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
            <Package className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
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
const ProductRow = ({ product, colors, onEdit, onDelete, isLoading }) => {
  return (
    <tr className={`${colors.tableHover}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Package className={`h-5 w-5 mr-2 ${colors.textMuted}`} />
          <span>{product.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Barcode className={`h-5 w-5 mr-2 ${colors.textMuted}`} />
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
        <ActionButton
          onClick={onEdit}
          icon={Edit2}
          variant="outline"
          colors={colors}
          disabled={isLoading}
          className="p-2 rounded-lg inline-flex items-center justify-center"
        />
        <ActionButton
          onClick={onDelete}
          icon={Trash}
          variant="danger"
          disabled={isLoading}
          className="p-2 rounded-lg inline-flex items-center justify-center"
        />
      </td>
    </tr>
  );
};

export default ProductList;
