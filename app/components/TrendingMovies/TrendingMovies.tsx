'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import Image from 'next/image';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import trendingBg from '../../../public/Symbols.png';
import Link from 'next/link';

interface Movie {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
}

interface Filter {
  name: string;
  value: string;
}

export default function TrendingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>('day');
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
  };
  const filters = require('./filterData.json');

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const data = await fetchData(`trending/all/${timePeriod}`);
        const moviesData: Movie[] = data.results.map((movie: any) => ({
          title: movie.title || movie.name,
          releaseDate: movie.release_date || movie.first_air_date,
          posterPath: movie.poster_path,
          voteAverage: movie.vote_average,
          id: movie.id,
        }));
        setMovies(moviesData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovieData();
  }, [timePeriod]);

  useEffect(() => {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 8,
      spaceBetween: 8,
    });
  }, [movies]);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start items-center my-4 px-8">
        <h2 className="pr-4 py-2 font-semibold text-2xl">Trending</h2>
        <div className="filter border-[1px] rounded-3xl h-full border-blue-950">
          {filters.map((filter: Filter) => (
            <span
              key={filter.value}
              className={`font-semibold text-base px-4 py-[6px] rounded-3xl cursor-pointer ${
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
        className="relative bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${trendingBg.src})` }}
      >
        <div className="swiper-container px-8 pb-8 overflow-x-auto">
          <div className="swiper-wrapper">
            {movies.map((movie, index) => (
              <div key={index} className="swiper-slide">
                {movie.posterPath && (
                  <Link
                    href={`/tv/${movie.id}`}
                    className="cursor-pointer hover:underline"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      width={150}
                      height={225}
                      className="rounded-lg h-[225px] width-[150px] cursor-pointer"
                    />
                  </Link>
                )}
                <span className="w-10 h-10 bg-backgroundColor text-white flex items-center justify-center text-xs font-bold rounded-full relative -top-4 left-2">
                  <svg
                    className="circular-outline absolute inset-[2px]"
                    viewBox="0 0 36 36"
                    style={{
                      transform: 'rotate(-90deg)',
                      strokeDasharray: 100,
                      strokeDashoffset:
                        100 - Math.round(movie.voteAverage * 10),
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
                        Math.round(movie.voteAverage * 10) > 80
                          ? '#B9F18C'
                          : Math.round(movie.voteAverage * 10) > 50
                          ? '#E9EB87'
                          : '#DB5A42'
                      }
                    />
                  </svg>

                  <span>
                    {Math.round(movie.voteAverage * 10)}
                    <sup className="text-[8px]">%</sup>
                  </span>
                </span>

                <Link
                  href={`/tv/${movie.id}`}
                  className="cursor-pointer hover:underline"
                >
                  <h2 className="font-bold text-base">{movie.title}</h2>
                </Link>
                <p className="text-base text-gray-600">{movie.releaseDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
