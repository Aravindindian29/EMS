/**
 * Utility functions for displaying employee data
 */

/**
 * Returns "NA" for empty/null values, otherwise returns the value
 * @param {any} value - The value to check
 * @returns {string} - "NA" if empty/null, otherwise the original value
 */
export const displayValueOrNA = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'NA';
  }
  return value;
};

/**
 * Returns "NA" for empty/null values with special handling for team_name
 * @param {any} value - The value to check
 * @returns {string} - "NA" if empty/null, otherwise the original value
 */
export const displayTeamOrNA = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'NA';
  }
  return value;
};

/**
 * Decode JWT token and return its payload
 * @param {string} token - The JWT token to decode
 * @returns {object|null} - The decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token is expired or invalid, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
