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
