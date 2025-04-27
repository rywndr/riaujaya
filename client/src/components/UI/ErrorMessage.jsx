import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center mt-1 text-sm text-red-600">
      <AlertCircle size={14} className="mr-1" />
      <span>{message}</span>
    </div>
  );
};
