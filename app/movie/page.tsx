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

export default function Movie() {
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
            const movieData = data.filter((item: any) => item.isMovie);
            setMedia(movieData);
            return;
          }
        }

        const movieData = await fetchData('discover/movie', sortBy);
        const filteredMovieData: Movie[] = movieData.results.map(
          (movie: any) => ({
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            id: movie.id,
            isMovie: true,
          })
        );

        localStorage.setItem(
          'cachedMediaData',
          JSON.stringify({
            data: filteredMovieData,
            timestamp: new Date().getTime(),
          })
        );

        setMedia(filteredMovieData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMediaData();
  }, [sortBy]);

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
                { value: 'popularity.desc', label: 'Popularity Descending' },
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
        className="w-[100vw] bg-mainColor  py-2 text-center mt-8 text-white font-base text-xl fixed bottom-0 hover:bg-blue-950"
      >
        Search
      </button>
    </>
  );
}
