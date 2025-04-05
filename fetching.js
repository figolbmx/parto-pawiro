// Define the fetchFamilyData function in the global scope
window.fetchFamilyData = function () {
  // Variables for Google Sheets API integration
  const spreadSheetName = "family-guy"; // Name of the Google Sheets spreadsheet
  const spreadSheetId = "1PNOyJh2a5RVcvDzGMztuV5c61b-Ouye12mzD1ImUzww"; // ID of the Google Sheets spreadsheet
  const apiKey = "AIzaSyDpIfv3g92V_-NpRrGRRvRv8eidaSDHWgY"; // API key for accessing Google Sheets API

  // Check if API key is defined in environment variables and use it if available
  if (process.env.GOOGLE_SHEETS_API_KEY) {
      apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    }
  
  // Return a promise for fetching family data from Google Sheets
  return new Promise((resolve, reject) => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${spreadSheetName}?alt=json&key=${apiKey}`)
      .then(response => response.json()) // Parse response as JSON
      .then(data => {
        const jsonResponse = data;
        // Extract the header row (field names)
        const headerRow = jsonResponse.values[0];

        // Initialize an array to store the transformed data, which contains family members data
        const transformedData = [];

        // Iterate over the remaining rows and transform them
        for (let i = 1; i < jsonResponse.values.length; i++) {
          const row = jsonResponse.values[i];

          // Create an object to hold the transformed row data
          const transformedRow = {};

          // Iterate over the cells in the row and assign them to the corresponding field names
          for (let j = 0; j < headerRow.length; j++) {
            const fieldName = headerRow[j];
            const cellValue = row[j];

            // Exclude null or empty values
            if (cellValue) {
              // Handle specific data types
              if (fieldName === "id" || fieldName === "fid" || fieldName === "mid") {
                transformedRow[fieldName] = parseInt(cellValue); // Convert to integer
              } else if (fieldName === "pids") {
                transformedRow[fieldName] = cellValue.split(",").map(pid => parseInt(pid)); // Convert comma-separated string to array of integers
              } else {
                transformedRow[fieldName] = cellValue; // Keep the value as is
              }
            }
          }

          // Add the transformed row object to the array
          transformedData.push(transformedRow);
        }
        resolve(transformedData); // Resolve the promise with transformed data
      })
      .catch(error => {
        console.log('Error:', error); // Log any errors to the console
        reject(error); // Reject the promise with the error
      });
  });
};
