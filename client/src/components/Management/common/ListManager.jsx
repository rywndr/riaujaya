import React, { useState, useEffect } from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import * as apiService from '../../../services/apiService';
import CommonUI from '../../UI/CommonUI';
import SearchInput from '../../UI/SearchInput';
import ActionButton from '../../UI/ActionButton';
import Pagination from '../../UI/Pagination';
import ConfirmationModal from '../../UI/ConfirmationModal';

// generic list manager component that can be used for products or sales
const ListManager = ({
  // component props
  initialItems, 
  colors, 
  itemType,  // 'product' or 'sales'
  searchFields,
  ItemList,
  ItemForm,
  headerIcon: HeaderIcon,
  headerTitle,
  headerDescription,
  itemLabel,
  addButtonIcon: AddButtonIcon,
  addButtonLabel,
  searchPlaceholder,
  
  // api methods
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  restoreItem,
}) => {
  // state for managing items
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [allItems, setAllItems] = useState(initialItems || []);
  
  // sorting state
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // initialize with items from props
  useEffect(() => {
    if (initialItems && !showArchived) {
      setAllItems(initialItems);
    }
  }, [initialItems]);

  // fetch all items including archived ones when needed
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsSubmitting(true);
        const data = await fetchItems(showArchived);
        setAllItems(data);
      } catch (err) {
        console.error(`error fetching ${itemLabel}:`, err);
        setOperationStatus({ type: 'error', text: `failed to load ${itemLabel}` });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    // if true toggle back to false or if there's any archived items
    if (showArchived || allItems.some(item => item.deleted_at)) {
      loadItems();
    }
  }, [showArchived, fetchItems, itemLabel]);

  // filter items based on search term and archived status
  const filteredItems = allItems.filter(item => {
    // filter by search term
    const matchesSearch = !searchTerm || searchFields.some(field => {
      const fieldValue = item[field];
      return fieldValue && fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    // filter by archived status
    const matchesArchiveFilter = showArchived 
      ? item.deleted_at !== null 
      : item.deleted_at === null;

    return matchesSearch && matchesArchiveFilter;
  });

  // sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // calculate pagination values
  const totalItems = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // ensure current page is valid after filtering
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  // get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

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
    setEditingItem(null);
    setShowAddForm(true);
  };

  // handle starting edit mode
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddForm(false);
  };

  // handle form submission for adding
  const handleAddItem = async (itemData) => {
    try {
      setIsSubmitting(true);
      await createItem(itemData);
      
      // show success message
      setOperationStatus({ type: 'success', text: `${itemLabel.singular} added successfully` });
      
      // reload items and reset form
      const data = await fetchItems(showArchived);
      setAllItems(data);
      setShowAddForm(false);
    } catch (err) {
      console.error(`error adding ${itemLabel.singular}:`, err);
      setOperationStatus({ type: 'error', text: `failed to add ${itemLabel.singular}` });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle form submission for editing
  const handleUpdateItem = async (id, itemData) => {
    try {
      setIsSubmitting(true);
      await updateItem(id, itemData);
      
      // show success message
      setOperationStatus({ type: 'success', text: `${itemLabel.singular} updated successfully` });
      
      // reload items and reset form
      const data = await fetchItems(showArchived);
      setAllItems(data);
      setEditingItem(null);
    } catch (err) {
      console.error(`error updating ${itemLabel.singular}:`, err);
      setOperationStatus({ type: 'error', text: `failed to update ${itemLabel.singular}` });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle initiating delete process
  const handleInitDeleteItem = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // handle soft delete item (archive)
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      setIsSubmitting(true);
      await deleteItem(itemToDelete);
      
      // show success message
      setOperationStatus({ type: 'success', text: `${itemLabel.singular} archived successfully` });
      
      // reload items
      const data = await fetchItems(showArchived);
      setAllItems(data);
    } catch (err) {
      console.error(`error archiving ${itemLabel.singular}:`, err);
      setOperationStatus({ type: 'error', text: `failed to archive ${itemLabel.singular}` });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };
  
  // handle restore item
  const handleRestoreItem = async (id) => {
    try {
      setIsSubmitting(true);
      await restoreItem(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: `${itemLabel.singular} restored successfully` });
      
      // reload items
      const data = await fetchItems(showArchived);
      setAllItems(data);
    } catch (err) {
      console.error(`error restoring ${itemLabel.singular}:`, err);
      setOperationStatus({ type: 'error', text: `failed to restore ${itemLabel.singular}` });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  // toggle showing archived items
  const toggleShowArchived = () => {
    setShowArchived(prev => !prev);
    setCurrentPage(1); 
  };

  return (
    <div>
      {/* confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteItem}
        title={`Archive ${itemLabel.singular}`}
        message={`Are you sure you want to archive this ${itemLabel.singular}? This item will be hidden from active views but can be restored later.`}
        icon={Archive}
        confirmLabel="Archive"
        cancelLabel="Cancel"
        type="danger"
        colors={colors}
        isLoading={isSubmitting}
      />

      {/* header */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-6`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className={`text-2xl font-bold ${colors.textColor}`}>
                <HeaderIcon className="inline-block mr-2" />
                {headerTitle}
              </h2>
              <p className={`${colors.textMuted} mt-1`}>
                {headerDescription}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                colors={colors}
                className="flex-1 sm:max-w-xs"
              />
              
              <div className="flex flex-row gap-2">
                <ActionButton
                  onClick={handleShowAddForm}
                  icon={AddButtonIcon}
                  label={addButtonLabel}
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
          
          {/* archived status */}
          {showArchived && (
            <div className={`p-2 rounded ${colors.cardBg} border border-amber-400 text-center text-sm ${colors.textMuted}`}>
              <Archive className="inline-block h-4 w-4 mr-1" />
              Showing archived {itemLabel.plural} only. Click "Hide Archived" to return to active items.
            </div>
          )}
        </div>
      </div>
      
      {/* operation status message */}
      <CommonUI.StatusMessage message={operationStatus} />
      
      {/* add form */}
      {showAddForm && (
        <ItemForm
          colors={colors}
          onSubmit={handleAddItem}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
          formTitle={`Add New ${itemLabel.singular}`}
        />
      )}
      
      {/* edit form */}
      {editingItem && (
        <ItemForm
          colors={colors}
          onSubmit={(data) => handleUpdateItem(editingItem.id, data)}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
          formTitle={`Edit ${itemLabel.singular}`}
          initialData={editingItem}
        />
      )}
      
      {/* items list */}
      <ItemList
        items={currentItems}
        totalCount={totalItems}
        colors={colors}
        onEdit={handleEdit}
        onDelete={handleInitDeleteItem}
        onRestore={handleRestoreItem}
        isLoading={isSubmitting}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onAddItem={handleShowAddForm}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* pagination controls */}
      {totalItems > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalItems}
          colors={colors}
          itemLabel={itemLabel.plural}
        />
      )}
    </div>
  );
};

export default ListManager;