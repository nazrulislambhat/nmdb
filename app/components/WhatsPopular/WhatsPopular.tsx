'use client';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils/api';
import Card from '../MovieCard/MovieCard';
interface Movie {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
  isMovie: boolean;
}

export default function WhatsPopular() {
  const [media, setMedia] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMediaData() {
      try {
        const cachedData = localStorage.getItem('cachedMediaData');
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const currentTime = new Date().getTime();
          const isDataStale = currentTime - timestamp > 24 * 60 * 60 * 1000;

          if (!isDataStale) {
            setMedia(data);
            return;
          }
        }
        const [movieData, tvData] = await Promise.all([
          fetchData('discover/movie'),
          fetchData('discover/tv'),
        ]);

        const combinedData: Movie[] = [
          ...movieData.results.map((movie: any) => ({
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            id: movie.id,
            isMovie: true,
          })),
          ...tvData.results.map((tvShow: any) => ({
            title: tvShow.name,
            releaseDate: tvShow.first_air_date,
            posterPath: tvShow.poster_path,
            voteAverage: tvShow.vote_average,
            id: tvShow.id,
            isMovie: false,
          })),
        ];

        localStorage.setItem(
          'cachedMediaData',
          JSON.stringify({
            data: combinedData,
            timestamp: new Date().getTime(),
          })
        );

        setMedia(combinedData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMediaData();
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="flex justify-start items-center pb-[20px] px-10">
        <h2 className="font-bold text-2xl">What`s Popular</h2>
      </div>
      <div className="relative">
        <div className="px-10">
          <div className="flex gap-4 overflow-x-auto">
            <Card media={media} />
          </div>
        </div>
      </div>
    </div>
  );
}
