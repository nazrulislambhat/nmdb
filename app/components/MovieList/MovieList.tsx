'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
}

export default function TrendingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>('day');
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
  };

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

  return (
    <div className="overflow-hidden">
      <div className="flex justify-start items-center pb-[20px]  px-10">
        <h2 className="font-semibold text-2xl">What`s Popular</h2>
      </div>
      <div className="relative">
        <div className="px-10">
          <div className="flex gap-4 overflow-x-auto">
            {movies.map((movie, index) => (
              <div
                key={index}
                className="flex flex-col mr-[4px]"
                style={{ flex: '0 0 150px' }}
              >
                {movie.posterPath && (
                  <Link
                    href={`/movie/${movie.id}`}
                    className="cursor-pointer hover:underline"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      width={150}
                      height={225}
                      className="rounded-lg cursor-pointer"
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
