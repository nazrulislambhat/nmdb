'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import clearIcon from '../../../public/clear.svg';
import movieIcon from '../../../public/movie.png';
import personIcon from '../../../public/user.png';
import televisionIcon from '../../../public/television.png';
import Image from 'next/image';
import searchIcon from '../../../public/search-black.svg';
import trendingIcon from '../../../public/trending.svg';
import loadingIcon from '../../../public/loading.gif';
import { useRouter, usePathname } from 'next/navigation';
import { fetchData } from '../../utils/api';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearchBoxActive, setIsSearchBoxActive] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(true);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };
  const handleClear = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  const handleSearchBoxClick = () => {
    setIsSearchBoxActive(true);
  };
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/search') {
      setShowSearchResults(false);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const moviesData = await fetchData('trending/movie/week');
        const tvShowsData = await fetchData('trending/tv/week');

        const combinedData = [
          ...moviesData.results,
          ...tvShowsData.results,
        ].sort((a, b) => b.popularity - a.popularity);

        const latest10Data = combinedData.slice(0, 10);

        setTrendingData(latest10Data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trending data:', error);
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchTrendingData, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const query = encodeURIComponent(searchQuery);

        const searchData = await fetchData('search/multi', query, 1, false);

        const latestResults = searchData.results.map((item: any) => ({
          title: item.title || item.name,
          media_type: item.media_type,
        }));

        const exactMatch = latestResults.find(
          (result: any) =>
            result.title.toLowerCase() === searchQuery.toLowerCase()
        );

        const remainingResults = latestResults.filter(
          (result: any) =>
            result.title.toLowerCase() !== searchQuery.toLowerCase()
        );

        const searchResultsToShow = exactMatch
          ? [exactMatch, ...remainingResults]
          : remainingResults;

        const latest10Results = searchResultsToShow.slice(0, 10);
        setSearchResults(latest10Results);

        setIsLoading(false);
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setIsLoading(false);
        setHasSearched(true);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const generateRedirectionURL = (item: any) => {
    const baseRedirectURL = `/search/${item.media_type}`;
    return `${baseRedirectURL}?query=${encodeURIComponent(searchQuery)}`;
  };

  const router = useRouter();
  const handleResultItemClick = (item: any) => {
    const redirectionURL = generateRedirectionURL(item);
    router.push(redirectionURL);
  };

  return (
    <div className="search-wrapper bg-white  z-40 flex justify-center w-full flex-col absolute top-[57px] left-0">
      <div className="search-container w-screen max-w-screen border-b-[1px] px-[26%] bg-white border-gray-300 py-1">
        <div
          className={`search-box flex justify-center items-center ${
            isSearchBoxActive ? 'active' : ''
          }`}
          onClick={handleSearchBoxClick}
        >
          <Image src={searchIcon} alt="Search Icon" width={15} height={15} />
          <input
            type="text"
            placeholder="Search for a movie, tv show, person..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleEnterKey}
            className="flex-grow py-2 px-4  focus-visible:outline-0 italic text-gray-300"
          />
          {isLoading ? (
            <Image
              src={loadingIcon}
              alt="Loading Icon"
              width={15}
              height={15}
            />
          ) : (
            <Image
              src={clearIcon}
              alt="Clear Icon"
              width={15}
              height={15}
              onClick={handleClear}
              className="cursor-pointer"
            />
          )}
        </div>
        {isSearchBoxActive && (
          <div className="search-results">
            {showSearchResults && !isLoading && (
              <ul>
                <h2 className="text-2xl flex items-center font-bold bg-gray-100 p-2">
                  <Image
                    src={trendingIcon}
                    alt="Trending Icon"
                    width={20}
                    height={20}
                    className="mr-1"
                  />
                  {hasSearched ? 'Search Results' : 'Trending'}
                </h2>
                {hasSearched && searchResults
                  ? searchResults.map((item: any) => (
                      <li
                        key={item.id}
                        className="border-b-[1px] flex items-center last:border-b-[0px] px-2 py-[2px] hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleResultItemClick(item)}
                      >
                        {item.media_type === 'movie' ? (
                          <Image
                            src={movieIcon}
                            alt="Movie Icon"
                            width={15}
                            height={10}
                            className="mr-2 w-[15px] h-[15px]"
                          />
                        ) : item.media_type === 'person' ? (
                          <Image
                            src={personIcon}
                            alt="Person Icon"
                            width={15}
                            height={10}
                            className="mr-2 w-[15px] h-[15px]"
                          />
                        ) : item.media_type === 'tv' ? (
                          <Image
                            src={televisionIcon}
                            alt="Television Icon"
                            width={15}
                            height={10}
                            className="mr-2 w-[15px] h-[15px]"
                          />
                        ) : (
                          <Image
                            src={searchIcon}
                            alt="Search Icon"
                            width={15}
                            height={15}
                            className="mr-2 w-[15px] h-[15px]"
                          />
                        )}

                        <div className="flex items-center">
                          <span className="font-bold pr-1">
                            {item.title || item.name}
                          </span>{' '}
                          in
                          <span className="font-base pl-1">
                            {item.media_type === 'movie'
                              ? 'Movies'
                              : item.media_type === 'tv'
                              ? 'TV Shows'
                              : item.media_type === 'person'
                              ? 'People'
                              : 'Unknown'}
                          </span>
                        </div>
                      </li>
                    ))
                  : trendingData.map((item: any) => (
                      <li
                        key={item.id}
                        className="border-b-[1px] flex items-center last:border-b-[0px] px-2 py-[2px] hover:bg-gray-100 cursor-pointer"
                      >
                        <Image
                          src={searchIcon}
                          alt="Search Icon"
                          width={15}
                          height={15}
                          className="mr-2 w-[15px] h-[15px]"
                        />
                        <span className="font-base">
                          {item.title || item.name}
                        </span>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
