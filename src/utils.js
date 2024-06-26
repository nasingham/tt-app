export async function fetchData(fields, params) {
    try {
      // Construct the base URL
      // const baseUrl = `http://localhost:9999/.netlify/functions/fetch-${fields}`;
      const baseUrl = `https://tradetrust-app.netlify.app/.netlify/functions/fetch-${fields}`;
  
      // Create URLSearchParams from the params object
      const urlParams = new URLSearchParams(params);
  
      // Construct the full URL with query parameters
      const url = `${baseUrl}?${urlParams.toString()}`;
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response in fetchData not ok');
      }
  
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  

