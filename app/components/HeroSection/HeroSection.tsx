'use client';
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import openhImage from '../../../public/openh.jpg';

export default function HeroSection(props) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.location.href = `/search?query=${searchQuery}`;
    }
  };
  return (
    <div
      className="hero-section px-0 py-14 mx-28 custom-bg"
      style={{ backgroundImage: `url(${openhImage.src})` }}
    >
      <div className="px-10 py-8">
        <h1 className="text-5xl text-white font-bold pb-2">{props.title}</h1>
        <p className="text-2xl text-white font-semibold pb-12">
          {props.subtitle}
        </p>
        <div className="search-container flex">
          <input
            type="text"
            placeholder="Search for a movie, tv show, person......"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            className="px-5 py-3 rounded-full relative w-[100%] focus-visible:outline-0"
          />
          <Link
            href={`/search?query=${searchQuery}`}
            passHref
            className="search-button rounded-full px-6 py-3 relative bg-gradient-to-r from-teal-500 to-blue-500 -left-[95px] text-white font-bold"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
