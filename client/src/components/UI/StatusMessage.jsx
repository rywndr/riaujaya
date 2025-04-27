import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const StatusMessage = ({ message }) => {
  if (!message || !message.text) return null;
  
  const isError = message.type === 'error';
  const isSuccess = message.type === 'success';
  
  return (
    <div className={`p-3 mb-4 text-sm flex items-center rounded-lg ${
      isError 
        ? 'text-red-600 bg-red-50 border border-red-200' 
        : isSuccess 
          ? 'text-green-600 bg-green-50 border border-green-200'
          : 'text-blue-600 bg-blue-50 border border-blue-200'
    }`}>
      {isError ? (
        <AlertCircle size={16} className="mr-2 flex-shrink-0" />
      ) : (
        <CheckCircle size={16} className="mr-2 flex-shrink-0" />
      )}
      <span>{message.text}</span>
    </div>
  );
};
