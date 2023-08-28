import bgImage from '../../../public/CTABannerBG.jpeg';
import Link from 'next/link';
interface CTABannerProps {
  title: string;
  subtitle: string;
  extras: string[];
}

export default function CTABanner({ title, subtitle, extras }: CTABannerProps) {
  return (
    <div
      className="px-[40px] py-[30px] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <div className="flex justify-center my-[20px]">
        <div className="wrapper-left" style={{ flex: '65%' }}>
          <p className="pb-[20px] text-white">{subtitle}</p>
          <Link href="#">
            <button className="mb-[20px] px-4 py-2 text-white rounded-lg bg-purpleColor cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
        <div style={{ width: '5%' }}></div> {/* Gap */}
        <div className="wrapper-right" style={{ flex: '20%' }}>
          <ul className="text-white">
            {extras.map((item, index) => (
              <li key={index} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
