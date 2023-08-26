import Logo from '../Header/Logo';
import React from 'react';
import Navigation from './Navigation';
import menuData from './menuData.json';
import Image from 'next/image';
import searchIcon from '../../../public/search.svg';

export default function Header() {
  return (
    <div className="header--wrapper px-28 py-5 bg-backgroundColor">
      <header className="header flex flex-start  max-w-[1300px] mx-auto flex-row items-center justify-start px-10 py-0">
        <div className="flex items-center">
          <div className="header--logo pr-16">
            <Logo />
          </div>
          <div className="header--nav">
            <Navigation menuData={menuData} />
          </div>
        </div>
        <div className="header--search relative cursor-pointer">
          <Image
            src={searchIcon}
            alt="Header Search Icon"
            width={20}
            height={20}
          />
        </div>
      </header>
    </div>
  );
}
