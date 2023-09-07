'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchData } from '../utils/api';
interface SearchProps {
  queryParam: string;
}
const mediaTypes = {
  movie: { label: 'Movies', endpoint: 'search/movie' },
  tv: { label: 'TV Shows', endpoint: 'search/tv' },
  person: { label: 'People', endpoint: 'search/person' },
  company: { label: 'Companies', endpoint: 'search/company' },
  collection: { label: 'Collections', endpoint: 'search/collection' },
  keyword: { label: 'Keywords', endpoint: 'search/keyword' },
};

export default function Search({ queryParam }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedMediaType, setSelectedMediaType] = useState<string>('movie');
  const [totalResults, setTotalResults] = useState<{ [key: string]: number }>({
    movie: 0,
    tv: 0,
    person: 0,
    company: 0,
    collection: 0,
    keyword: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = encodeURIComponent(searchQuery);

      const promises = Object.keys(mediaTypes).map(async (mediaType) => {
        const endpoint =
          mediaTypes[mediaType as keyof typeof mediaTypes].endpoint;
        const searchData = await fetchData(endpoint, query, 1, false);

        const totalResults = searchData ? searchData.total_results : 0;

        return { mediaType, totalResults };
      });

      const results = await Promise.all(promises);

      const newTotalResults: { [key: string]: number } = {};
      results.forEach((result) => {
        newTotalResults[result.mediaType] = result.totalResults;
      });
      setTotalResults(newTotalResults);
    };

    if (searchQuery) {
      const timeoutId = setTimeout(fetchSearchResults, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const mediaTypeKeys = Object.keys(mediaTypes);

  return (
    <div className="mx-auto max-w-[1440px] min-h-screen">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie, TV show, person..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-5 py-3 border-b-[1px] border-gray-300 focus-visible:outline-0 w-full"
        />
      </div>
      <div className="search-result flex gap-2 my-8">
        <div className="result-filter shadow rounded-lg min-w-[300px] max-h-[370px] mr-4">
          <h2 className="bg-mainColor px-5 py-5 text-white rounded-t-lg font-base text-xl">
            Search Results
          </h2>
          <ul className="rounded-b-lg mt-2 mb-2">
            {mediaTypeKeys.map((mediaType) => (
              <li
                key={mediaType}
                className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                  selectedMediaType === mediaType ? 'selected' : ''
                } hover:font-bold hover:bg-gray-200`}
                onClick={() => {
                  router.push(`/search/${mediaType}/?query=${searchQuery}`);
                }}
              >
                {mediaTypes[mediaType as keyof typeof mediaTypes].label}
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  {totalResults[mediaType]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
