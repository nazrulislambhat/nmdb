'use client';
import { useState, useEffect } from 'react';
import { fetchData } from '../utils/api';
import Card from '../components/MovieCard/MovieCard';
import { Select, Space } from 'antd';

interface Movie {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
  isMovie: boolean;
}

export default function Popular() {
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

  const handleChange = (value: string) => {
    
  };

  return (
    <div className="overflow-hidden mx-auto max-w-[1440px] min-h-screen mt-[80px]">
      <div className="flex justify-start items-start gap-4 px-10">
        <div className="sidebar min-w-[250px]">
          <h2 className="font-bold text-xl pb-4">Popular Movies</h2>
          <Select
            defaultValue="popularity.desc"
            style={{ width: 220 }}
            onChange={handleChange}
            options={[
              { value: 'popularity.desc', label: 'Popularity Decending' },
              { value: 'popularity.asc', label: 'Popularity Ascending' },
            ]}
          />
        </div>
        <div className="card">
          <Card media={media} customStyles={true} />
        </div>
      </div>
    </div>
  );
}
