import React, { useEffect, useRef } from 'react';
import { AlertCircle, X, Check, ChevronLeft } from 'lucide-react';
import ActionButton from './ActionButton';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  icon: Icon = AlertCircle, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel', 
  type = 'danger', // 'danger', 'warning', 'info'
  colors, 
  isLoading 
}) => {
  const modalRef = useRef(null);

  // close when clicking outside the modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, isLoading]);

  // focus trap
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // determine icon and color theme based on type
  let iconColor, iconBgColor, confirmVariant;
  
  switch (type) {
    case 'danger':
      iconColor = 'text-red-500';
      iconBgColor = 'bg-red-100 dark:bg-red-900/20';
      confirmVariant = 'danger';
      break;
    case 'warning':
      iconColor = 'text-amber-500';
      iconBgColor = 'bg-amber-100 dark:bg-amber-900/20';
      confirmVariant = 'warning';
      break;
    default: 
      iconColor = 'text-blue-500';
      iconBgColor = 'bg-blue-100 dark:bg-blue-900/20';
      confirmVariant = 'primary';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className={`${colors.cardBg} max-w-md w-full rounded-xl shadow-xl transform transition-all duration-200 ease-in-out`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* modal content */}
        <div className="p-6">
          {/* header */}
          <div className="flex items-center mb-4">
            <div className={`rounded-full p-2 mr-3 ${iconBgColor}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <h3 
              id="modal-title" 
              className={`text-xl font-semibold ${colors.textColor}`}
            >
              {title}
            </h3>
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className={`ml-auto rounded-full p-1 ${colors.buttonGhost} ${colors.transition}`}
              aria-label="Close modal"
            >
              <X className={`h-5 w-5 ${colors.textColor}`} />
            </button>
          </div>
          
          {/* msg */}
          <div className={`mb-6 ${colors.textColor}`}>
            <p>{message}</p>
          </div>
          
          {/* acction btns */}
          <div className="flex justify-end gap-3">
            <ActionButton
              onClick={onClose}
              icon={ChevronLeft}
              label={cancelLabel}
              variant="ghost"
              colors={colors}
              disabled={isLoading}
              className="px-4 py-2"
            />
            <ActionButton
              onClick={onConfirm}
              icon={Check}
              label={confirmLabel}
              variant={confirmVariant}
              colors={colors}
              isLoading={isLoading}
              className="px-4 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;