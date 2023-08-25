import React from 'react';
import Link from 'next/link';
import footerData from './footerData.json';

export default function FooterNav() {
  return (
    <footer className="flex">
      {Object.entries(footerData).map(([menuName, items]) => (
        <div key={menuName} className="menu px-10 text-white leading-6">
          <h2 className="font-bold">{menuName}</h2>
          <ul className="font-normal text-sm leading-6">
            {items.map(({ label, link }) => (
              <li key={label}>
                <Link href={link} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </footer>
  );
}
