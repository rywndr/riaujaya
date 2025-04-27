import { useState, useEffect } from 'react';

// custom hook to check if url has valid token
export const useUrlToken = () => {
  const [isValid, setIsValid] = useState(null);
  
  useEffect(() => {
    // check if url has the access_token query parameter
    const hash = window.location.hash;
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('access_token');
    
    // if no token is present in url, set invalid
    if (!hash && !accessToken) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, []);
  
  return isValid;
};
