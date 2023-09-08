'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import trendingBg from '../../../public/Symbols.png';
import Card from '../MovieCard/MovieCard';
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
        className="relative  bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${trendingBg.src})` }}
      >
        <div className="px-10">
          <Card media={media} />
        </div>
      </div>
    </div>
  );
}
