'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchData } from '../utils/api';
import Image from 'next/image';
import noPerson from '../../public/no-person.svg';
import noImage from '../../public/no-image.svg';
import { Pagination } from 'antd';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
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

  const fetchSearchResults = async (mediaTypeToLoad = 'movie') => {
    const query = encodeURIComponent(searchQuery);

    const endpoint = (mediaTypes as Record<string, { endpoint: string }>)[
      mediaTypeToLoad
    ].endpoint;

    const searchData = await fetchData(endpoint, query, currentPage, false);

    if (searchData) {
      const totalResults = searchData.total_results;

      let items = [];

      if (mediaTypeToLoad === 'person') {
        items = searchData.results.map((result: any) => ({
          name: result.name,
          knownFor: result.known_for.map((item: any) => item.title).join(', '),
          knownForDepartment: result.known_for_department,
          profilePath: result.profile_path,
          media_type: result.media_type,
        }));
      } else if (mediaTypeToLoad === 'company') {
        items = searchData.results.map((result: any) => ({
          name: result.name || result.title,
          origin_country: result.origin_country,
          logoPath: result.logo_path,
        }));
      } else {
        items = searchData.results.map((result: any) => ({
          name: result.name || result.title,
          media_type: result.media_type,
          backdropPath: result.backdrop_path,
          release_date: result.release_date || result.first_air_date,
          first_air_date: result.first_air_date,
          overview: result.overview,
          profile_path: result.profile_path,
          known_for: result.known_for,
          known_for_department: result.known_for_department,
        }));
      }
      const newTotalResults = { ...totalResults };
      newTotalResults[mediaTypeToLoad] = totalResults;
      setTotalResults(newTotalResults);

      setCurrentItems(items);
      const itemsPerPage = 20;
      const calculatedTotalPages = Math.ceil(totalResults / itemsPerPage);
      setTotalPages(calculatedTotalPages);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(
        () => fetchSearchResults(selectedMediaType),
        500
      );
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, currentPage, selectedMediaType]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    router.replace(`/search?query=${newSearchQuery}`);
  };

  const mediaTypeKeys = Object.keys(mediaTypes);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMediaTypeSelection = (mediaType: string) => {
    setSelectedMediaType(mediaType);
    setCurrentPage(1);
    fetchSearchResults(mediaType);
  };

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
                onClick={() => handleMediaTypeSelection(mediaType)}
              >
                {mediaTypes[mediaType as keyof typeof mediaTypes].label}
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  {totalResults[mediaType]}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="selected-media-items flex flex-col">
          {selectedMediaType !== 'person' &&
            selectedMediaType !== 'company' &&
            currentItems.map((item, index) => (
              <div key={index} className="shadow mb-4 rounded-xl flex gap-4">
                {item.backdropPath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`}
                    alt="Poster"
                    width={94}
                    height={141}
                    className="rounded-l-lg cursor-pointer min-w-[94px] h-[141px]"
                  />
                ) : (
                  <div className="rounded-l-lg cursor-pointer h-[141px] bg-gray-300 flex items-center justify-center">
                    <Image
                      src={noImage}
                      alt=" No Poster"
                      width={94}
                      height={141}
                      className="rounded-l-lg cursor-pointer min-w-[94px] h-[141px]"
                    />
                  </div>
                )}
                <div className="pt-4 pr-2">
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

          {selectedMediaType === 'person' &&
            currentItems.map((item, index) => (
              <div key={index} className="flex content-center mb-4 gap-4">
                <div className="cursor-pointer h-[70px] bg-gray-300 rounded-lg flex items-center justify-center">
                  {item.profilePath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.profilePath}`}
                      alt="Person Photo"
                      width={70}
                      height={70}
                      className="rounded-lg cursor-pointer min-w-[70px] h-[70px]"
                    />
                  ) : (
                    <Image
                      src={noPerson}
                      alt="Person No Photo"
                      width={70}
                      height={70}
                      className="rounded-lg cursor-pointer min-w-[70px] h-[70px]"
                    />
                  )}
                </div>
                <div className="pr-2 pt-2">
                  <p className="font-semibold text-base hover:text-gray-600 cursor-pointer">
                    {item.name}
                  </p>
                  <p className="text-gray-900 text-sm">
                    {item.knownForDepartment} • {item.knownFor}
                  </p>
                </div>
              </div>
            ))}

          {selectedMediaType === 'company' &&
            currentItems.map((item, index) => (
              <div
                key={index}
                className="flex content-center items-center	w-[50vw] border-b-[1px] py-2 border-black"
              >
                <div className="cursor-pointer">
                  {item.logoPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.logoPath}`}
                      alt={item.name}
                      width={100}
                      height={40}
                      className="cursor-pointer min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px]"
                    />
                  ) : (
                    <p>{item.name}</p>
                  )}
                </div>
                {item.origin_country && (
                  <div className="">
                    <span className="ml-2 text-white font-base text-xs bg-gray-300 px-[10px] py-[2px] rounded-md w-fit">
                      {item.origin_country}
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={totalPages * 10}
        className="text-center"
      />
    </div>
  );
}
