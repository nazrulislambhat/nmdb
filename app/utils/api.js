async function fetchData(
  endpoint,
  query,
  page = 1,
  includeAdult = false,
  releaseDateRange = ''
) {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    include_adult: includeAdult,
    language: 'en-US',
    page: page,
    'primary_release_date.gte': releaseDateRange.split('|')[0],
    'primary_release_date.lte': releaseDateRange.split('|')[1],
  });

  queryParams.append('query', query);

  const apiUrl = `${API_URL}${endpoint}?${queryParams.toString()}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

export { fetchData };
