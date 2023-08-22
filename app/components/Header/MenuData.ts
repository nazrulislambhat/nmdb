import headerMenuData from './menuData.json';

export type MenuItem = {
  text: string;
  link: string;
  children: MenuItem[] | null;
};

export type MenuData = MenuItem[];

export default headerMenuData as MenuData;
