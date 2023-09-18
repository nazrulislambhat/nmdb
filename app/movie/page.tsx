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
interface LanguageOption {
  value: string;
  label: string;
}
interface LanguageFilterOptionProps {
  input: string;
  option: { label: string; value: string };
}

const languageOptions: LanguageOption[] = [
  {
    value: 'none',
    label: 'None selected',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'de',
    label: 'German',
  },
  {
    value: 'es',
    label: 'Spanish',
  },
  {
    value: 'it',
    label: 'Italian',
  },
  {
    value: 'hi',
    label: 'Hindi',
  },
  {
    value: 'cn',
    label: 'Cantonese',
  },
];

const { CheckableTag } = Tag;

const tagsData = [
  28, // Action
  12, // Adventure
  16, // Animation
  35, // Comedy
  80, // Crime
  99, // Documentary
  18, // Drama
  10751, // Family
  14, // Fantasy
  36, // History
  27, // Horror
  10402, // Music
  9648, // Mystery
  10749, // Romance
  878, // Science Fiction
  10770, // TV Movie
  53, // Thriller
  10752, // War
  37, // Western
];

dayjs.extend(customParseFormat);
const dateFormat = 'M/D/YYYY';

export default function Movie() {
  const [media, setMedia] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languageHasMovies, setLanguageHasMovies] = useState<boolean>(true);
  const [selectedLanguageName, setSelectedLanguageName] = useState<
    string | null
  >(null);

  const [genreMapping, setGenreMapping] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    async function fetchGenreData() {
      try {
        const genreResponse = await fetchData('genre/movie/list');
        const genreData = genreResponse.genres.reduce(
          (
            acc: { [key: number]: string },
            genre: { id: number; name: string }
          ) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );
        setGenreMapping(genreData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchGenreData();
  }, []);

  const handleTagChange = (tagId: number, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tagId]
      : selectedTags.filter((id) => id !== tagId);
    setSelectedTags(nextSelectedTags);
  };

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

        const filteredMovieData: Movie[] = movieData.results
          .filter((movie: any) => {
            const movieGenreIds: number[] = movie.genre_ids;
            return selectedTags.every((tagId) => movieGenreIds.includes(tagId));
          })
          .filter((movie: any) => {
            if (!selectedLanguage) {
              // No language filter, include all movies
              return true;
            }
            return movie.original_language === selectedLanguage;
          })
          .map((movie: any) => ({
            title: movie.title,
            releaseDate: movie.release_date,
            posterPath: movie.poster_path,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            popularity: movie.popularity,
            id: movie.id,
            isMovie: true,
          }));

        setMedia(filteredMovieData);
        if (selectedLanguage && filteredMovieData.length === 0) {
          setLanguageHasMovies(false);
        } else {
          setLanguageHasMovies(true);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMediaData();
  }, [selectedTags, sortBy, fromDate, toDate, selectedLanguage]);

  const handleChange = (value: string) => {
    setSortBy(value);
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

  const languageFilterOption = (
    input: string,
    option: LanguageFilterOptionProps['option']
  ) => option?.label.toLowerCase().includes(input.toLowerCase());

  const onLanguageChange = (value: string) => {
    const selectedOption = languageOptions.find(
      (option) => option.value === value
    );
    setSelectedLanguage(value === 'none' ? null : value);
    setSelectedLanguageName(selectedOption ? selectedOption.label : null);
    setLanguageHasMovies(true);
  };

  const onLanguageSearch = (value: string) => {
    console.log('search:', value);
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
                {tagsData.map((tagId, index) => (
                  <CheckableTag
                    key={index}
                    checked={selectedTags.includes(tagId)}
                    onChange={(checked) => handleTagChange(tagId, checked)}
                    className="border-[1px] px-3 py-1 rounded-full font-bold border-slate-400 active:bg-mainColor focus:bg-mainColor focus:text-white checked:bg-mainColor enabled:bg-mainColor visited:bg-mainColor hover:text-white hover:bg-mainColor"
                  >
                    {genreMapping[tagId]}
                  </CheckableTag>
                ))}
              </Space>
            </div>
            <div>
              <p className="text-lg text-gray-600 mt-4 mb-2 flex max-h-[20px] items-center">
                Language
                <span className=" bg-gray-400 text-xs text-white font-bold w-2 p-2 rounded-full h-2 flex justify-center items-center ml-1">
                  ?
                </span>
              </p>
              <Select
                showSearch
                optionFilterProp="children"
                className="min-w-[8vw]"
                onChange={onLanguageChange}
                onSearch={onLanguageSearch}
                filterOption={languageFilterOption as any}
                defaultValue="none"
                options={languageOptions}
              />
            </div>
          </div>

          <div className="card mt-8">
            {languageHasMovies ? (
              <Card media={media} customStyles={true} />
            ) : (
              <p className="text-3xl flex items-center">
                No Movies for{' '}
                <span className="text-base bg-gradient-to-r from-cyan-500  to-blue-500 px-2 py-[3px] mx-1 text-white font-bold rounded-md">
                  {selectedLanguageName}
                </span>{' '}
                language
              </p>
            )}
            <button className="w-[100%] bg-gradient-to-r from-cyan-500  to-blue-500 text-base rounded-md border px-8 py-2 text-white font-bold my-4 hover:text-black">
              Load More
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSort(sortBy)}
        className="w-[100vw] bg-gradient-to-r from-cyan-500  to-blue-500 py-3 text-center mt-8 text-white font-base text-xl fixed bottom-0 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-emerald-700"
      >
        Search
      </button>
    </>
  );
}
