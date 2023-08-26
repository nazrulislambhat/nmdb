import React from 'react';
import Link from 'next/link';
import { MenuData, MenuItem } from './MenuData';

interface NavigationProps {
  menuData: MenuData;
}

function renderMenuItem(item: MenuItem) {
  return (
    <li key={item.text} className="relative group">
      <Link
        href={item.link}
        passHref
        className="block text-white font-semibold text-base pr-5"
      >
        {item.text}
      </Link>
      {item.children && (
        <ul className="hidden absolute left-0 top-full bg-white shadow-md group-hover:block rounded-lg max-h-[689.4px] text-base font-normal">
          {item.children.map((child) => (
            <li key={child.text}>
              <Link
                href={child.link}
                passHref
                className="block py-2 px-6 hover:bg-gray-100 font-normal text-base rounded-md whitespace-nowrap"
              >
                {child.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

const Navigation: React.FC<NavigationProps> = ({ menuData }) => {
  return (
    <ul className="flex flex-row items-center space-x-4">
      {menuData.map((item) => renderMenuItem(item))}
    </ul>
  );
};

export default Navigation;
