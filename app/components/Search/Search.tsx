'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import clearIcon from '../../../public/clear.svg';
import Image from 'next/image';
import { fetchData } from '../../utils/api';
import searchIcon from '../../../public/search-black.svg';
import trendingIcon from '../../../public/trending.svg';
import loadingIcon from '../../../public/loading.gif';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };
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

  return (
    <div className="search-wrapper z-40 flex justify-center w-full flex-col absolute top-[57px] left-0">
      <div className="search-container w-screen max-w-7xl border-b-2 mx-auto bg-white border-gray-300 px-4 py-1">
        <div className="flex justify-center items-center">
          <Image src={searchIcon} alt="Search Icon" width={20} height={20} />
          <input
            type="text"
            placeholder="Search for a movie, tv show, person..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow py-2 px-4  focus-visible:outline-0"
          />
          {isLoading ? (
            <Image
              src={loadingIcon}
              alt="Loading Icon"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src={clearIcon}
              alt="Clear Icon"
              width={20}
              height={20}
              onClick={handleClear}
              className="cursor-pointer"
            />
          )}
        </div>
        <div className="trending-data">
          <h2 className="text-2xl flex font-bold bg-gray-100 p-2">
            <Image
              src={trendingIcon}
              alt="Trending Icon"
              width={20}
              height={20}
              className="mr-1"
            />
            Latest Trending
          </h2>
          <ul>
            {!isLoading &&
              trendingData.map((item: any) => (
                <li
                  key={item.id}
                  className="border-b-[1px] flex last:border-b-[0px] px-2 py-[2px] hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={searchIcon}
                    alt="Search Icon"
                    width={15}
                    height={15}
                    className="mr-1"
                  />
                  <span className="">{item.title || item.name}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
