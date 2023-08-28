'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import YouTube from 'react-youtube';
import Image from 'next/image';

interface Movie {
  title: string;
  key: string;
  name: string;
  id: string;
  backdropPath: string;
}

interface Filter {
  name: string;
  value: string;
}

export default function TopMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('streaming'); 

  const filters = require('./filterData.json'); 

  useEffect(() => {
    fetchTopMovies();
  }, [activeFilter]);

  const fetchTopMovies = async () => {
    try {
      const data = await fetchData(`/discover/movie?filter=${activeFilter}`);
      console.log('Fetched data:', data);

      const movieIds = data.results.map((movie: any) => movie.id);

      setMovies(trailerMovies.slice(0, 20));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleVideoClick = (videoId: string) => {
    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(videoId);
    }
  };

  return (
    <div className="top-movies pt-[30px] px-[40px] bg-backgroundColor">
      <div className="filter-tabs mb-4 border-[1px] border-green-300 w-fit rounded-3xl">
        {filters.map((filter: Filter) => (
          <span
            key={filter.value}
            className={`text-white px-4 text-sm py-[4px] cursor-pointer ${
              activeFilter === filter.value
                ? 'font-semibold  px-4 py-[2px] rounded-3xl text-black cursor-pointer bg-green-300'
                : ''
            }`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.name}
          </span>
        ))}
      </div>
      <h2 className="pr-4 py-2 font-semibold text-white text-2xl">
        Latest Trailers
      </h2>
      <div className="movie-list flex gap-4 justify-between py-[20px] overflow-x-auto">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item mb-8 ">
            <div
              onClick={() => handleVideoClick(movie.key)}
              className="mb-4 rounded-lg overflow-hidden"
            >
              <YouTube videoId={movie.key} opts={{ width: '300' }} />
            </div>
            <h3 className="text-lg text-white text-center">{movie.title}</h3>
            <h4 className="text-sm text-white text-center">{movie.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
