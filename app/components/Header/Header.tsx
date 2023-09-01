'use client';
import React, { useState } from 'react';
import Logo from '../Header/Logo';
import Navigation from './Navigation';
import menuData from './menuData.json';
import Image from 'next/image';
import searchIcon from '../../../public/search.svg';
import closeIcon from '../../../public/close.svg';
import Search from '../Search/Search';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="header--wrapper px-4 py-2 sm:px-28 sm:py-4 bg-backgroundColor">
      <header className="header flex flex-start max-w-[1300px] mx-auto flex-row items-center justify-between px-10 py-0">
        <div className="flex items-center">
          <div className="header--logo pr-16">
            <Logo />
          </div>
          <div className="header--nav">
            <Navigation menuData={menuData} />
          </div>
        </div>
        <div
          className="header--search relative cursor-pointer"
          onClick={toggleSearch}
        >
          {isSearchOpen ? (
            <Image src={closeIcon} alt="Close Icon" width={25} height={25} />
          ) : (
            <Image
              src={searchIcon}
              alt="Header Search Icon"
              width={20}
              height={20}
            />
          )}
        </div>
      </header>
      {isSearchOpen && <Search />}
    </div>
  );
}
