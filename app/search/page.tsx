'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchData } from '../utils/api';
import noImage from '../../public/no-image.svg';
import noPerson from '../../public/no-person.svg';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [tvResults, setTVResults] = useState<any[]>([]);
  const [collectionResults, setCollectionResults] = useState<any[]>([]);
  const [personResults, setPersonResults] = useState<any[]>([]);
  const [companiesResults, setCompaniesResults] = useState<any[]>([]);
  const [keywordsResults, setKeywordsResults] = useState<any[]>([]);
  const [networksResults, setNetworksResults] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedMediaType, setSelectedMediaType] = useState<string>('movie');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const query = encodeURIComponent(searchQuery);

        const searchData = await fetchData('search/multi', query, 1, false);

        const latestResults = searchData.results.map((item: any) => ({
          title: item.title || item.name,
          name: item.original_name || item.name,
          media_type: item.media_type,
          poster_path: item.poster_path,
          profile_path: item.profile_path,
          overview: item.overview,
          release_date: item.release_date,
          first_air_date: item.first_air_date,
          known_for_department: item.known_for_department,
        }));

        const movieResults = latestResults.filter(
          (result: any) => result.media_type === 'movie'
        );

        const tvResults = latestResults.filter(
          (result: any) => result.media_type === 'tv'
        );

        const personResults = latestResults.filter(
          (result: any) => result.media_type === 'person'
        );

        const collectionsResults = latestResults.filter(
          (result: any) => result.media_type === 'collections'
        );

        const companiesResults = latestResults.filter(
          (result: any) => result.media_type === 'companies'
        );

        const keywordsResults = latestResults.filter(
          (result: any) => result.media_type === 'keywords'
        );
        const networksResults = latestResults.filter(
          (result: any) => result.media_type === 'networks'
        );

        setMovieResults(movieResults);
        setTVResults(tvResults);
        setPersonResults(personResults);
        setCollectionResults(collectionResults);
        setNetworksResults(networksResults);
        setCompaniesResults(companiesResults);
        setKeywordsResults(keywordsResults);

        setSearchResults(latestResults);

        setIsLoading(false);
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setIsLoading(false);
        setHasSearched(true);
      }
    };

    if (searchQuery) {
      const timeoutId = setTimeout(fetchSearchResults, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedMediaType]);

  const calculateTotalResultsByMediaType = (mediaType: string) => {
    return searchResults.filter((result) => result.media_type === mediaType)
      .length;
  };

  const totalMovies = calculateTotalResultsByMediaType('movie');
  const totalTVShows = calculateTotalResultsByMediaType('tv');
  const totalPersons = calculateTotalResultsByMediaType('person');
  const totalCollections = calculateTotalResultsByMediaType('collections');
  const totalCompanies = calculateTotalResultsByMediaType('companies');
  const totalKeywords = calculateTotalResultsByMediaType('keywords');
  const totalNetworks = calculateTotalResultsByMediaType('networks');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMediaTypeClick = (mediaType: string) => {
    setSelectedMediaType(mediaType);
  };

  return (
    <div className="mx-auto max-w-[1440px] min-h-screen">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie, tv show, person..."
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
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'movie' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('movie')}
            >
              <Link href="/">Movies</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalMovies}
              </span>
            </li>
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'tv' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('tv')}
            >
              <Link href="/">TV Shows</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalTVShows}
              </span>
            </li>
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'collections' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('collections')}
            >
              <Link href="/">Collections</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalCollections}
              </span>
            </li>
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'person' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('person')}
            >
              <Link href="/">People</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalPersons}
              </span>
            </li>
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'companies' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('companies')}
            >
              <Link href="/">Companies</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalCompanies}
              </span>
            </li>
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'keywords' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('keywords')}
            >
              <Link href="/">Collections</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalKeywords}
              </span>
            </li>
            <li
              className={`flex justify-between content-center items-center cursor-pointer px-4 py-1 ${
                selectedMediaType === 'networks' ? 'selected' : ''
              } hover:font-bold hover:bg-gray-200`}
              onClick={() => setSelectedMediaType('networks')}
            >
              <Link href="/">Networks</Link>
              <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                {totalNetworks}
              </span>
            </li>
          </ul>
        </div>
        <div className="result-cards flex flex-col gap-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : hasSearched ? (
            selectedMediaType === 'movie' ? (
              movieResults.map((result, index) => (
                <div
                  className="result-card h-[140px] overflow-hidden rounded-md flex shadow"
                  key={index}
                >
                  {result.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                      alt={result.title}
                      width={94}
                      height={141}
                      className="rounded-l-lg cursor-pointer object-fit"
                    />
                  ) : (
                    <Image
                      src={noImage}
                      alt={result.title}
                      width={94}
                      height={141}
                      className="rounded-l-lg cursor-pointer object-fit min-h-[140px] bg-gray-200"
                    />
                  )}
                  <div className="movie-info px-5 py-4">
                    <p className="font-semibold text-xl hover:text-gray-600 cursor-pointer">
                      {result.title}
                    </p>
                    <p className="text-gray-400 pb-4">{result.release_date}</p>
                    <p className="text-clip overflow-hidden max-h-[2.8em]">
                      {result.overview}
                    </p>
                  </div>
                </div>
              ))
            ) : selectedMediaType === 'tv' ? (
              tvResults.map((result, index) => (
                <div
                  className="result-card h-[140px] overflow-hidden rounded-md flex shadow"
                  key={index}
                >
                  {result.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                      alt={result.title}
                      width={94}
                      height={141}
                      className="rounded-l-lg cursor-pointer object-fit"
                    />
                  ) : (
                    <Image
                      src={noImage}
                      alt={result.title}
                      width={94}
                      height={141}
                      className="rounded-l-lg cursor-pointer object-fit min-h-[140px] bg-gray-200"
                    />
                  )}

                  <div className="movie-info px-5 py-4">
                    <p className="font-semibold text-xl hover:text-gray-600 cursor-pointer">
                      {result.title}
                    </p>
                    <p className="text-gray-400 pb-4">
                      {result.first_air_date}
                    </p>
                    <p className="text-clip overflow-hidden max-h-[2.8em]">
                      {result.overview}
                    </p>
                  </div>
                </div>
              ))
            ) : selectedMediaType === 'collections' ? (
              collectionResults.map((result, index) => (
                <div
                  className="result-card h-[140px] overflow-hidden rounded-md flex shadow"
                  key={index}
                >
                  {/* collection result */}
                </div>
              ))
            ) : selectedMediaType === 'person' ? (
              personResults.map((result, index) => (
                <div
                  className="result-card overflow-hidden flex items-center"
                  key={index}
                >
                  {result.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${result.profile_path}`}
                      alt={result.name}
                      width={70}
                      height={70}
                      className="cursor-pointer rounded-lg h-[70px]"
                    />
                  ) : (
                    <Image
                      src={noPerson}
                      alt={result.name}
                      width={70}
                      height={70}
                      className="cursor-pointer object-contain bg-gray-200 rounded-lg"
                    />
                  )}

                  <div className="movie-info px-5 py-4">
                    <p className="font-semibold text-xl hover:text-gray-600 cursor-pointer">
                      {result.name}
                    </p>
                    <p className="text-base hover:text-gray-600 cursor-pointer">
                      {result.known_for_department} •{' '}
                      {result.known_for_department}
                    </p>
                  </div>
                </div>
              ))
            ) : selectedMediaType === 'companies' ? (
              companiesResults.map((result, index) => (
                <div
                  className="result-card h-[140px] overflow-hidden rounded-md flex shadow"
                  key={index}
                >
                  {/* companies result */}
                </div>
              ))
            ) : selectedMediaType === 'keywords' ? (
              keywordsResults.map((result, index) => (
                <div
                  className="result-card h-[140px] overflow-hidden rounded-md flex shadow"
                  key={index}
                >
                  {/* keywords result */}
                </div>
              ))
            ) : selectedMediaType === 'networks' ? (
              networksResults.map((result, index) => (
                <div
                  className="result-card h-[140px] overflow-hidden rounded-md flex shadow"
                  key={index}
                >
                  {/* networks result */}
                </div>
              ))
            ) : (
              <p>No results found</p>
            )
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
