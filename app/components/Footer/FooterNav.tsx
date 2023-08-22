import React from 'react';
import Link from 'next/link';
import footerData from './footerData.json';

export default function FooterNav ()  {
  const menus = Object.keys(footerData);

  return (
    <footer className='flex'>
      {menus.map((menuName) => (
        <div key={menuName} className="menu px-10 text-white leading-6">
          <h2 className='font-bold'>{menuName}</h2>
          <ul className='font-normal text-sm leading-6'>
            {footerData[menuName].map((item, index) => (
              <li key={index}>
                <Link href={item.link} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </footer>
  );
};

