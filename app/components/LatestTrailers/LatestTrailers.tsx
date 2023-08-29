'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import YouTube from 'react-youtube';

interface Movie {
  title: string;
  key: string;
  name: string;
  id: string;
  backdropPath: string;
}

interface TVShow {
  title: string;
  name: string;
  key: string;
  id: string;
  backdropPath: string;
}

interface Filter {
  name: string;
  value: string;
}

export default function TopMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('streaming');

  useEffect(() => {
    fetchTopMovies();
    fetchTopTVShows();
  }, []);

  const fetchTopMovies = async () => {
    try {
      const currentDate = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(currentDate.getMonth() - 4);

      const movieData = await fetchData('/discover/movie');
      const filteredMovies = movieData.results
        .filter((movie: any) => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate >= lastMonth && releaseDate <= currentDate;
        })
        .map(async (movie: any) => {
          const trailersResponse = await fetchData(`/movie/${movie.id}/videos`);
          const trailer = trailersResponse.results.find(
            (result: any) => result.type === 'Trailer'
          );

          if (trailer) {
            return {
              title: movie.title,
              key: trailer.key,
              name: trailer.name,
              id: movie.id,
              backdropPath: movie.backdrop_path,
            };
          }

          return null;
        });

      const movieResults = await Promise.all(filteredMovies);
      const filteredMovieResults = movieResults.filter(
        (movie: Movie | null) => movie !== null
      );

      setMovies(filteredMovieResults);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTopTVShows = async () => {
    try {
      const currentDate = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(currentDate.getMonth() - 3);

      const tvData = await fetchData('/discover/tv');
      const filteredTVShows = tvData.results.map(async (tvShow: any) => {
        const trailersResponse = await fetchData(`/tv/${tvShow.id}/videos`);

        const trailer = trailersResponse.results.find(
          (result: any) => result.type === 'Trailer'
        );

        if (trailer) {
          return {
            name: tvShow.name,
            key: trailer.key,
            id: tvShow.id,
            backdropPath: tvShow.backdrop_path,
          };
        }

        return null;
      });

      const tvResults = await Promise.all(filteredTVShows);
      const filteredTVShowResults = tvResults.filter(
        (tvShow: TVShow | null) => tvShow !== null
      );

      setTVShows(filteredTVShowResults);
    } catch (error) {
      console.error('Error fetching TV data:', error);
    }
  };

  const handleVideoClick = (videoId: string) => {
    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(videoId);
    }
  };

  const filters: Filter[] = require('./filterData.json');

  return (
    <div
      className="top-movies pt-[20px] mb-[30px] h-full px-[40px] bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: (
          activeFilter === 'streaming' ? movies.length > 0 : tvShows.length > 0
        )
          ? `url(https://image.tmdb.org/t/p/original${
              activeFilter === 'streaming'
                ? movies[0]?.backdropPath
                : tvShows[3]?.backdropPath
            })`
          : 'none',
      }}
    >
      <div className="absolute inset-0 bg-backgroundColor opacity-80 pointer-events-none" />
      <div className="relative z-10">
        <h2 className="pr-4 py-2 font-semibold text-white text-2xl">
          Latest Trailers
        </h2>
        <div className="filter-tabs mb-4 border-[1px] border-green-300 w-fit rounded-3xl">
          {filters.map((filter: Filter) => (
            <span
              key={filter.value}
              className={`text-white px-4 text-sm py-[3px] cursor-pointer ${
                activeFilter === filter.value
                  ? 'px-4 rounded-3xl text-black  font-semibold cursor-pointer bg-green-300'
                  : ''
              }`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.name}
            </span>
          ))}
        </div>
        <div className="movie-list flex gap-4 justify-between py-[20px] overflow-x-auto">
          {(activeFilter === 'streaming' ? movies : tvShows).map(
            (item: Movie | TVShow) => (
              <div key={item.id} className="movie-item mb-4">
                <div
                  onClick={() => handleVideoClick(item.key)}
                  className="yt-trailer mb-4 rounded-lg overflow-hidden"
                >
                  <YouTube
                    videoId={item.key}
                    opts={{ width: '300', height: '168' }}
                  />
                </div>
                <h3 className="text-lg text-white text-center">
                  {item.title || item.name}
                </h3>
                {item.name && (
                  <h4 className="text-sm text-white text-center">
                    {item.name}
                  </h4>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
