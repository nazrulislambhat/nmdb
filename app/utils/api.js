// utils/api.js

async function fetchData(endpoint, query, page = 1, includeAdult = false) {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    include_adult: includeAdult,
    language: 'en-US',
    page: page,
  });

  queryParams.append('query', query);

  const apiUrl = `${API_URL}${endpoint}?${queryParams.toString()}`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

export { fetchData };
