'use client';
import { useState, useEffect } from 'react';
import { fetchData } from '../utils/api';
import Card from '../components/MovieCard/MovieCard';
import { Select } from 'antd';

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
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
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
    setSortBy(value);
  };

  const handleSort = () => {
    const sortedMedia = [...media];
    if (sortBy === 'popularity.desc') {
      sortedMedia.sort((a, b) => b.voteAverage - a.voteAverage);
    } else if (sortBy === 'popularity.asc') {
      sortedMedia.sort((a, b) => a.voteAverage - b.voteAverage);
    }
    setMedia(sortedMedia);
  };

  return (
    <>
      <div className="overflow-hidden mx-auto max-w-[1440px] min-h-screen mt-[50px]">
        <div className="flex justify-start items-start gap-8 px-10">
          <div className="sidebar shadow min-h-screen rounded mt-8 p-4 min-w-[250px]">
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
          <div className="card mt-8">
            <Card media={media} customStyles={true} />
          </div>
        </div>
      </div>
      <button
        onClick={handleSort}
        className="w-[100vw] bg-mainColor  py-2 text-center mt-8 text-white font-base text-2xl fixed bottom-0 hover:bg-blue-950"
      >
        Search
      </button>
    </>
  );
}
