import React from 'react';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';

const CommonUI = {
  LoadingView: ({ colors, message = "loading data..." }) => (
    <div className={`w-full ${colors?.appBg || ''} ${colors?.textColor || ''} min-h-screen flex items-center justify-center`}>
      <div className="text-center">
        <Loader className="h-12 w-12 animate-spin mx-auto" />
        <p className="mt-4">{message}</p>
      </div>
    </div>
  ),
  
  ErrorView: ({ colors, error, onRetry = () => window.location.reload() }) => (
    <div className={`w-full ${colors?.appBg || ''} ${colors?.textColor || ''} min-h-screen flex items-center justify-center`}>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md w-full">
        <strong className="font-bold">error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={onRetry}
        >
          try again
        </button>
      </div>
    </div>
  ),
  
  ErrorMessage: ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle size={14} className="mr-1" />
        <span>{message}</span>
      </div>
    );
  },
  
  StatusMessage: ({ message }) => {
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
  }
};

export default CommonUI;
