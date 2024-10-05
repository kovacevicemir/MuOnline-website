const sanitizeInput = (input, options = {}) => {
    // Return empty if undefined, null, or if trimmed input is empty
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return '';
    }
  
    // Default options: max length and allowed characters
    const {
      maxLength = 20,
      allowedChars = /^[a-zA-Z0-9]+$/, // Default to alphanumeric only
    } = options;
  
    // Trim leading/trailing spaces
    let sanitizedInput = input.trim();
  
    // Check for length, throw error or handle accordingly if needed
    if (sanitizedInput.length > maxLength) {
      sanitizedInput = sanitizedInput.substring(0, maxLength); // Limit to max length
    }
  
    // Remove/replace any characters not allowed by regex
    if (!allowedChars.test(sanitizedInput)) {
      // Optionally handle invalid characters here (could escape or reject)
      sanitizedInput = sanitizedInput.replace(/[^a-zA-Z0-9]/g, ''); // Default: strip invalid chars
    }
  
    return sanitizedInput;
  };

  // Email validation logic
const validateEmail = (email, maxLength = 100) => {
    if (!email || typeof email !== 'string') {
      return false;
    }
  
    email = email.trim();
    
    // Check if the email exceeds the max length
    if (email.length > maxLength) {
      return false;
    }
  
    // Basic email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Return true if the email is valid and false if it's not
    return emailRegex.test(email);
  };

  module.exports = {
    sanitizeInput, // Exporting the sanitizeInput function
    validateEmail
  };