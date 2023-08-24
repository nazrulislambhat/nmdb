import Image from 'next/image';
import Link from 'next/link';
import logoSrc from '../../../public/tmdb-header.svg';

export default function Logo() {
  return (
    <Link href="/" passHref>
      <Image src={logoSrc} alt="TMDB Header Logo" width={154} height={20} />
    </Link>
  );
}
