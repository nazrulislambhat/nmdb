import Logo from '../Footer/Logo';
import React from 'react';
import FooterNav from './FooterNav';
import FooterButton from './FooterButton';

export default function Footer() {
  return (
    <footer className="flex flex-row items-end justify-center  bg-backgroundColor m-h-357 mt-20 p-8">
      <div className="flex flex-col items-end">
        <Logo />
        <FooterButton />
      </div>
      <div className="">
        <FooterNav />
      </div>
    </footer>
  );
}
