'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchData } from '../utils/api';
import Image from 'next/image';
import noPerson from '../../public/no-person.svg';
import noImage from '../../public/no-image.svg';
export interface SearchProps {
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

export default function Search() {
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

  const [currentItems, setCurrentItems] = useState<any[]>([]);

  const router = useRouter();

  const fetchSearchResults = async () => {
    const query = encodeURIComponent(searchQuery);

    const promises = Object.keys(mediaTypes).map(async (mediaType) => {
      const endpoint =
        mediaTypes[mediaType as keyof typeof mediaTypes].endpoint;
      const searchData = await fetchData(endpoint, query, 1, false);
      console.log(searchData);
      if (searchData) {
        const totalResults = searchData.total_results;
        const items = searchData.results.map((result: any) => ({
          name: result.name || result.title,
          backdropPath: result.backdrop_path,
          release_date: result.release_date || result.first_air_date,
          first_air_date: result.first_air_date,
          overview: result.overview,
          profile_path: result.profile_path,
          known_for: result.known_for,
          known_for_department: result.known_for_department,
        }));
        if (mediaType === selectedMediaType) {
          setCurrentItems(items);
        }

        return { mediaType, totalResults };
      } else {
        return { mediaType, totalResults: 0 };
      }
    });

    const results = await Promise.all(promises);

    const newTotalResults: { [key: string]: number } = {};
    results.forEach((result) => {
      newTotalResults[result.mediaType] = result.totalResults;
    });
    setTotalResults(newTotalResults);
  };

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(fetchSearchResults, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedMediaType]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    router.replace(`/search?query=${newSearchQuery}`);
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
      <div className="search-result flex gap-2 my-16">
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
                  setSelectedMediaType(mediaType);
                  fetchSearchResults();
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
        <div className="selected-media-items flex gap-5 flex-col">
          {currentItems.map((item, index) => (
            <div key={index} className="shadow rounded-xl flex gap-4">
              {item.backdropPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`}
                  alt={item.title}
                  width={94}
                  height={141}
                  className="rounded-l-lg cursor-pointer min-w-[94px] h-[141px]"
                />
              ) : (
                <div className="rounded-l-lg cursor-pointer h-[141px] bg-gray-300 flex items-center justify-center">
                  <Image
                    src={noImage}
                    alt={item.title}
                    width={94}
                    height={141}
                    className="rounded-l-lg cursor-pointer min-w-[94px] h-[141px]"
                  />
                </div>
              )}
              <div className="py-4 pr-2">
                <p className="font-semibold text-xl hover:text-gray-600 cursor-pointer">
                  {item.name}
                </p>
                <p className="text-gray-400 pb-4">{item.release_date}</p>
                <p className="text-clip overflow-hidden max-h-[2.8em]">
                  {item.overview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
