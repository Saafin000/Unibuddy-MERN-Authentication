// backend/config/adminWhitelist.js

// Add admin emails to this array
export const ADMIN_WHITELIST = [
  'saafin@gdgu.org',
  'kiyosha@gdgu.org',
  'samkit@gdgu.org',
  // Add more admin emails as needed
];

// Function to check if email is admin
export const isAdminEmail = (email) => {
  return ADMIN_WHITELIST.includes(email.toLowerCase());
};