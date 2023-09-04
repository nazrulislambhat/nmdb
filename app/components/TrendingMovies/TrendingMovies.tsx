'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import Image from 'next/image';
import Link from 'next/link';
import noImage from '../../../public/no-image.png';
import trendingBg from '../../../public/Symbols.png';

interface MediaItem {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
  isMovie: boolean;
}

interface Filter {
  name: string;
  value: string;
}

export default function TrendingMovies() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>('day');

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
  };

  const filters: Filter[] = [
    { name: 'Today', value: 'day' },
    { name: 'This Week', value: 'week' },
  ];

  useEffect(() => {
    async function fetchMediaData() {
      try {
        const cachedData = localStorage.getItem(
          `cachedMediaData-${timePeriod}`
        );
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const currentTime = new Date().getTime();
          const isDataStale = currentTime - timestamp > 24 * 60 * 60 * 1000;

          if (!isDataStale) {
            setMedia(data);
            return;
          }
        }
        const data = await fetchData(`trending/all/${timePeriod}`);
        const mediaData: MediaItem[] = data.results.map((item: any) => ({
          title: item.title || item.name,
          releaseDate: item.release_date || item.first_air_date,
          posterPath: item.poster_path,
          voteAverage: item.vote_average,
          id: item.id,
          isMovie: item.media_type === 'movie',
        }));
        setMedia(mediaData);
        localStorage.setItem(
          `cachedMediaData-${timePeriod}`,
          JSON.stringify({ data: mediaData, timestamp: new Date().getTime() })
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchMediaData();
  }, [timePeriod]);

  return (
    <div className="overflow-hidden">
      <div className="flex justify-start items-center my-4 px-10">
        <h2 className="pr-4 py-2 font-semibold text-2xl">Trending</h2>
        <div className="filter border-[1px] rounded-3xl h-full border-blue-950">
          {filters.map((filter: Filter) => (
            <span
              key={filter.value}
              className={`font-semibold text-base px-4 py-[1px] rounded-3xl cursor-pointer ${
                timePeriod === filter.value
                  ? 'bg-backgroundColor text-teal-500'
                  : 'text-blue-950'
              }`}
              onClick={() => handleTimePeriodChange(filter.value)}
            >
              {filter.name}
            </span>
          ))}
        </div>
      </div>
      <div
        className="relative  bg-contain bg-no-repeat bg-bottom"
        style={{ backgroundImage: `url(${trendingBg.src})` }}
      >
        <div className="px-10">
          <div className="flex sm:flex-row gap-4 overflow-x-auto">
            {media.map((item, index) => (
              <div
                key={index}
                className="flex flex-col mr-[4px]"
                style={{ flex: '0 0 150px' }}
              >
                <Link
                  href={item.isMovie ? `/movie/${item.id}` : `/tv/${item.id}`}
                  className="cursor-pointer hover:underline h-[225px]"
                >
                  {item.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                      alt={item.title}
                      width={150}
                      height={225}
                      className="rounded-lg cursor-pointer h-[225px]"
                    />
                  ) : (
                    <Image
                      src={noImage}
                      alt="No Image"
                      width={150}
                      height={225}
                      className="rounded-lg cursor-pointer h-[225px]"
                    />
                  )}
                </Link>
                <span className="w-10 h-10 bg-backgroundColor text-white flex items-center justify-center text-xs font-bold rounded-full relative -top-4 left-2">
                  <svg
                    className="circular-outline absolute inset-[2px]"
                    viewBox="0 0 36 36"
                    style={{
                      transform: 'rotate(-90deg)',
                      strokeDasharray: 100,
                      strokeDashoffset: 100 - Math.round(item.voteAverage * 10),
                    }}
                  >
                    <circle
                      className="circle "
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      strokeWidth="2"
                      stroke={
                        Math.round(item.voteAverage * 10) > 80
                          ? '#B9F18C'
                          : Math.round(item.voteAverage * 10) > 50
                          ? '#E9EB87'
                          : '#DB5A42'
                      }
                    />
                  </svg>

                  <span>
                    {Math.round(item.voteAverage * 10)}
                    <sup className="text-[8px]">%</sup>
                  </span>
                </span>

                <Link
                  href={item.isMovie ? `/movie/${item.id}` : `/tv/${item.id}`}
                  className="cursor-pointer hover:underline"
                >
                  <h2 className="font-bold text-base">{item.title}</h2>
                </Link>
                <p className="text-base text-gray-600">{item.releaseDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
