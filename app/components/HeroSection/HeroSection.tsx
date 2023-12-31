'use client';
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import openhImage from '../../../public/openh.jpg';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const router = useRouter();

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div
      className="hero-section px-0 py-14 g-cover bg-center bg-no-repeat z-0"
      style={{ backgroundImage: `url(${openhImage.src})` }}
    >
      <div className="px-10 py-8">
        <h1 className="text-5xl text-white font-bold pb-2">{title}</h1>
        <p className="text-2xl text-white font-semibold pb-12">{subtitle}</p>
        <div className="search-container flex">
          <input
            type="text"
            placeholder="Search for a movie, tv show, person......"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            className="px-5 py-3 rounded-full z-0 relative w-[100%] focus-visible:outline-0"
          />
          <Link
            href={`/search?query=${searchQuery}`}
            passHref
            className="search-button rounded-full px-6 py-3 absolute z-20 right-10 bg-gradient-to-r from-teal-500 to-blue-500  text-white font-bold sm:relative sm:-left[95px]"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
