'use client';

import { useState, ChangeEvent } from 'react';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Link from 'next/link';
import Image from 'next/image';
import posterImage from '../../public/avengers.jpg';
export default function Search() {
  const [searchQuery, setsearchQuery] = useState<string>('');
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setsearchQuery(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a movie, tv show, person......"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-5 py-3 w-screen border-b-[1px] border-gray-300 focus-visible:outline-0"
          />
        </div>
        <div className="search-result flex gap-2 mx-28 my-8">
          <div className="result-filter border-2 rounded-lg w-[450px]">
            <h2 className="bg-mainColor px-5 py-5 text-white rounded-t-lg font-base text-xl">
              Search Results
            </h2>
            <ul className="rounded-b-lg mt-2 mb-2">
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold hover:bg-gray-200">
                <Link href="/">Movies</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  109
                </span>
              </li>
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold hover:bg-gray-200">
                <Link href="/">TV Shows</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  15
                </span>
              </li>
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold hover:bg-gray-200">
                <Link href="/">Collections</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  6
                </span>
              </li>
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold hover:bg-gray-200">
                <Link href="/">Keywords</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  1
                </span>
              </li>
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold hover:bg-gray-200">
                <Link href="/">People</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  0
                </span>
              </li>
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold hover:bg-gray-200">
                <Link href="/">Companies</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  0
                </span>
              </li>
              <li className="flex justify-between content-center items-center cursor-pointer px-4 py-1 hover:font-bold mb-2 hover:bg-gray-200">
                <Link href="/">Networks</Link>
                <span className="bg-gray-200 flex justify-center content-center items-center w-max rounded-xl text-gray-700 px-2 py-1">
                  0
                </span>
              </li>
            </ul>
          </div>
          <div className="result-cards">
            <div className="result-card max-h-[160px] flex rounded-lg border-[1px] mb-4">
              <Image
                src={posterImage}
                width={94}
                height={141}
                alt="Movie Poster"
                className="rounded-l-lg cursor-pointer"
              />
              <div className="flex flex-col px-5 py-3 shadow-md">
                <Link
                  href="/"
                  className="font-semibold text-3xl hover:text-gray-600 cursor-pointer"
                >
                  Avengers: Endgame
                </Link>
                <p className="text-gray-400 pb-4">April 27, 2018</p>
                <p>
                  As the Avengers and their allies have continued to protect the
                  world from threats too large for any one hero to handle, a new
                  danger has emerged from the cosmic shadows: Thanos. A despot
                  of intergalactic infamy, his goal is to collect all six
                  Infinity Stones, artifacts of
                </p>
              </div>
            </div>
            <div className="result-card max-h-[160px] flex rounded-lg border-[1px] mb-4">
              <Image
                src={posterImage}
                width={94}
                height={141}
                alt="Movie Poster"
                className="rounded-l-lg cursor-pointer"
              />
              <div className="flex flex-col px-5 py-3 shadow-md">
                <Link
                  href="/"
                  className="font-semibold text-3xl hover:text-gray-600 cursor-pointer"
                >
                  Avengers: Endgame
                </Link>
                <p className="text-gray-400 pb-4">April 27, 2018</p>
                <p>
                  As the Avengers and their allies have continued to protect the
                  world from threats too large for any one hero to handle, a new
                  danger has emerged from the cosmic shadows: Thanos. A despot
                  of intergalactic infamy, his goal is to collect all six
                  Infinity Stones, artifacts of
                </p>
              </div>
            </div>
            <div className="result-card max-h-[160px] flex rounded-lg border-[1px] mb-4">
              <Image
                src={posterImage}
                width={94}
                height={141}
                alt="Movie Poster"
                className="rounded-l-lg cursor-pointer"
              />
              <div className="flex flex-col px-5 py-3 shadow-md">
                <Link
                  href="/"
                  className="font-semibold text-3xl hover:text-gray-600 cursor-pointer"
                >
                  Avengers: Endgame
                </Link>
                <p className="text-gray-400 pb-4">April 27, 2018</p>
                <p>
                  As the Avengers and their allies have continued to protect the
                  world from threats too large for any one hero to handle, a new
                  danger has emerged from the cosmic shadows: Thanos. A despot
                  of intergalactic infamy, his goal is to collect all six
                  Infinity Stones, artifacts of
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
