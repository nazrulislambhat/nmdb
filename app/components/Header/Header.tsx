import Logo from '../Header/Logo';
import React from 'react';
import Navigation from './Navigation';
import menuData from './menuData.json'
import Image from 'next/image'
import searchIcon from '../../../public/search.svg'
export default function Header() {
    return (
            <header className='header flex flex-start justify-between flex-row items-center justify-start p-5 pr-44 pl-44 bg-backgroundColor'>
                <div className='flex items-center'>
                    <div className='header--logo pr-16'>
                        <Logo />
                    </div>
                    <div className='header--nav'>
                        <Navigation menuData={menuData} />
                    </div>
                </div>
                <div className='header--search relative cursor-pointer'>
                    <Image
                    src={searchIcon}
                    alt="Header Search Icon"
                    width={20}
                    height={20}
                    />
                </div>
            </header>
    )
}