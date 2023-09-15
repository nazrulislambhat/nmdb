'use client';
import { useState, useEffect } from 'react';
import { fetchData } from '../utils/api';
import Card from '../components/MovieCard/MovieCard';
import { Select, DatePicker, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

interface Movie {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
  voteCount: number;
  popularity: number;
  isMovie: boolean;
}
const { CheckableTag } = Tag;

const tagsData = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science',
  'Fiction',
  'TV Movie',
  'Thriller',
  'War',
  'Western',
];

dayjs.extend(customParseFormat);
const dateFormat = 'M/D/YYYY';

export default function Movie() {
  const [media, setMedia] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Books']);
  const [genreMapping, setGenreMapping] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    async function fetchMediaData() {
      try {
        let releaseDateRange = '';

        if (fromDate && toDate) {
          releaseDateRange = `${dayjs(fromDate, dateFormat).format(
            'YYYY-MM-DD'
          )}|${dayjs(toDate, dateFormat).format('YYYY-MM-DD')}`;
        } else {
          releaseDateRange = `|${dayjs().format('YYYY-MM-DD')}`;
          setSortBy('release_date.desc');
        }

        const movieData = await fetchData(
          'discover/movie',
          sortBy,
          1,
          false,
          releaseDateRange
        );
        console.log(movieData);
        const filteredMovieData: Movie[] = movieData.results.map(
          (movie: any) => ({
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            popularity: movie.popularity,
            id: movie.id,
            isMovie: true,
          })
        );
        setMedia(filteredMovieData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMediaData();
  }, [sortBy, fromDate, toDate]);

  const handleChange = (value: string) => {
    setSortBy(value);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const handleSort = (sortBy: string) => {
    const sortedMedia = [...media];

    switch (sortBy) {
      case 'vote_average.desc':
        sortedMedia.sort((a, b) => b.voteAverage - a.voteAverage);
        break;
      case 'vote_average.asc':
        sortedMedia.sort((a, b) => a.voteAverage - b.voteAverage);
        break;
      case 'vote_count.desc':
        sortedMedia.sort((a, b) => b.voteCount - a.voteCount);
        break;
      case 'vote_count.asc':
        sortedMedia.sort((a, b) => a.voteCount - b.voteCount);
        break;
      case 'popularity.desc':
        sortedMedia.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'popularity.asc':
        sortedMedia.sort((a, b) => a.popularity - b.popularity);
        break;
      case 'release_date.desc':
        sortedMedia.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        );
        break;
      case 'release_date.asc':
        sortedMedia.sort(
          (a, b) =>
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
        );
        break;
      default:
        sortedMedia.sort((a, b) => b.voteAverage - a.voteAverage);
        break;
    }

    setMedia(sortedMedia);
  };

  return (
    <>
      <div className="overflow-hidden mx-auto max-w-[1440px] min-h-screen mt-[50px]">
        <div className="flex justify-start items-start gap-8 px-10">
          <div className="sidebar shadow  rounded mt-8 p-4 min-w-[250px] max-w-[260px]">
            <h2 className="font-bold text-xl mb-4">Popular Movies</h2>
            <Select
              defaultValue="popularity.desc"
              style={{ width: 220 }}
              className="mb-4"
              onChange={handleChange}
              options={[
                {
                  value: 'popularity.asc',
                  label: 'Popularity Ascending',
                },
                {
                  value: 'popularity.desc',
                  label: 'Popularity Descending',
                },
                {
                  value: 'revenue.asc',
                  label: 'Revenue Ascending',
                },
                {
                  value: 'revenue.desc',
                  label: 'Revenue Descending',
                },
                {
                  value: 'primary_release_date.asc',
                  label: 'Release Date Ascending',
                },
                {
                  value: 'primary_release_date.desc',
                  label: 'Release Date Descending',
                },
                {
                  value: 'vote_average.asc',
                  label: 'Vote Average Ascending',
                },
                {
                  value: 'vote_average.desc',
                  label: 'Vote Average Descending',
                },
                {
                  value: 'vote_count.asc',
                  label: 'Vote Count Ascending',
                },
                {
                  value: 'vote_count.desc',
                  label: 'Vote Count Descending',
                },
              ]}
            />

            <div className="flex flex-col mb-2">
              <p className="text-lg text-gray-600 mb-2">Release Dates</p>
              <span className="flex justify-between items-center text-gray-400 mb-4">
                from
                <DatePicker
                  format={dateFormat}
                  value={fromDate ? dayjs(fromDate, dateFormat) : null}
                  onChange={(date) =>
                    setFromDate(date ? date.format(dateFormat) : null)
                  }
                />
              </span>
              <span className="flex justify-between items-center text-gray-400">
                to
                <DatePicker
                  format={dateFormat}
                  value={toDate ? dayjs(toDate, dateFormat) : null}
                  onChange={(date) =>
                    setToDate(date ? date.format(dateFormat) : null)
                  }
                />
              </span>
            </div>
            <div>
              <p className="text-lg text-gray-600 mt-4 mb-2">Genres</p>
              <Space size={[0, 12]} wrap>
                {tagsData.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleTagChange(tag, checked)}
                    className="border-[1px] px-3 py-1 rounded-full font-bold border-slate-400  active:bg-mainColor focus:bg-mainColor focus:text-white checked:bg-mainColor enabled:bg-mainColor visited:bg-mainColor hover:text-white hover:bg-mainColor"
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </div>
          </div>

          <div className="card mt-8">
            <Card media={media} customStyles={true} />
            <button className="w-[100%] bg-mainColor text-2xl rounded-md border px-8 py-2 text-white font-bold my-4 hover:text-black">
              Load More
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSort(sortBy)}
        className="w-[100vw] bg-mainColor py-3 text-center mt-8 text-white font-base text-xl fixed bottom-0 hover:bg-sky-950"
      >
        Search
      </button>
    </>
  );
}
