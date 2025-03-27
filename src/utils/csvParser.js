/**
 * Utility function to parse CSV text into structured data
 * Handles quoted values and properly maps headers to values
 */
export function parseCSV(csvText) {
  // Split the CSV text into lines
  const lines = csvText.trim().split('\n');
  
  // Extract headers from the first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse the data rows
  const data = lines.slice(1).map(line => {
    // Handle quoted values properly
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue.trim());
    
    // Create an object with header keys and row values
    return headers.reduce((obj, header, index) => {
      // Remove quotes from values if present
      let value = values[index] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      obj[header] = value;
      return obj;
    }, {});
  });
  
  return {
    headers,
    data
  };
}

/**
 * Convert parsed CSV data to a downloadable CSV file
 */
export function convertToCSV(data, headers = null) {
  // If headers are not provided, use the keys of the first object
  const csvHeaders = headers || Object.keys(data[0] || {});
  
  // Create the header row
  const headerRow = csvHeaders.join(',');
  
  // Create the data rows
  const dataRows = data.map(item => {
    return csvHeaders.map(header => {
      const value = item[header] || '';
      // Quote values that contain commas or quotes
      if (value.includes(',') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
}