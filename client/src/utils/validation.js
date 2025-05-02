// validation helpers
export const validatePassword = (password) => {
  if (!password.trim()) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  return '';
};

export const validateConfirmPassword = (confirm, password) => {
  if (!confirm.trim()) {
    return 'Please confirm your password';
  }
  
  if (confirm !== password) {
    return 'Passwords do not match';
  }
  
  return '';
};

export const validateEmail = (email) => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  // basic email validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

export const validateFullName = (fullName) => {
  if (!fullName.trim()) {
    return 'Full name is required';
  }
  
  return '';
};
