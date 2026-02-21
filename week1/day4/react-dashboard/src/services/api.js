const BASE_URL = "http://localhost:4000";

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log("Retrying request...");
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, retries - 1, delay * 2); // exponential backoff
    }
    throw error;
  }
}

export async function fetchData(endpoint) {
  return fetchWithRetry(`${BASE_URL}${endpoint}`);
}