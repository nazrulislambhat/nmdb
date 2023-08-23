'use client'
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import openhImage from '../../../public/openh.jpg'

export default function HeroSection() {
    
    const [searchTerm, setSearchTerm] = useState<string>('');
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    
    return (
          <div className="hero-section px-0 py-14 mx-28 custom-bg" style={{ backgroundImage: `url(${openhImage.src})` }}>
            <div className='px-10 py-8'>
                <h1 className='text-5xl text-white font-bold pb-2'>Welcome</h1>
                <p className='text-2xl text-white font-semibold pb-12'>Millions of movies, TV shows and people to discover. Explore now.</p>
                <div className="search-container w-screen flex">
                    <input
                        type="text"
                        placeholder="Search for a movie, tv show, person......"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className='px-5 py-3 rounded-full w-[79vw] focus-visible:outline-0'
                    />
                    <Link href={`/search?term=${searchTerm}`} passHref className="search-button rounded-full px-6 py-3 relative bg-gradient-to-r from-teal-500 to-blue-500 -left-[95px] text-white font-bold">
                    Search
                    </Link>
                </div>
            </div>
        </div>
    )

}
