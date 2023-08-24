import Image from 'next/image';
import Link from 'next/link';
import logoSrc from '../../../public/tmdb-footer.svg';

export default function Logo() {
  return (
    <Link href="/" passHref>
      <Image src={logoSrc} alt="TMDB Footer Logo" width={130} height={60} />
    </Link>
  );
}
