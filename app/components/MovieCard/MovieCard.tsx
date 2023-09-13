import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import noImage from '../../../public/no-image.svg';

interface MediaItem {
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
  id: number;
  isMovie: boolean;
}

interface CardProps {
  media: MediaItem[];
  customStyles?: boolean;
}

export default function Card({ media, customStyles }: CardProps) {
  return (
    <div
      className={`flex ${
        customStyles ? 'flex-wrap gap-4' : 'gap-4 overflow-x-auto'
      } `}
    >
      {media.map((item, index) => (
        <div
          key={index}
          className="flex flex-col mr-[4px]"
          style={{ flex: '0 0 150px' }}
        >
          <Link
            href={item.isMovie ? `/movie/${item.id}` : `/tv/${item.id}`}
            className="cursor-pointer hover:underline h-[225px]"
          >
            {item.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                alt={item.title}
                width={150}
                height={225}
                className="rounded-lg cursor-pointer h-[225px]"
              />
            ) : (
              <Image
                src={noImage}
                alt="No Image"
                width={150}
                height={225}
                className="rounded-lg cursor-pointer h-[225px] bg-gray-200"
              />
            )}
          </Link>
          <span className="w-10 h-10 bg-backgroundColor text-white flex items-center justify-center text-xs font-bold rounded-full relative -top-4 left-2">
            <svg
              className="circular-outline absolute inset-[2px]"
              viewBox="0 0 36 36"
              style={{
                transform: 'rotate(-90deg)',
                strokeDasharray: 100,
                strokeDashoffset: 100 - Math.round(item.voteAverage * 10),
              }}
            >
              <circle
                className="circle"
                cx="18"
                cy="18"
                r="16"
                fill="transparent"
                strokeWidth="2"
                stroke={
                  Math.round(item.voteAverage * 10) > 80
                    ? '#B9F18C'
                    : Math.round(item.voteAverage * 10) > 50
                    ? '#E9EB87'
                    : '#DB5A42'
                }
              />
            </svg>
            <span>
              {Math.round(item.voteAverage * 10)}
              <sup className="text-[8px]">%</sup>
            </span>
          </span>
          <Link
            href={item.isMovie ? `/movie/${item.id}` : `/tv/${item.id}`}
            className="cursor-pointer hover:underline"
          >
            <h2 className="font-bold text-base">{item.title}</h2>
          </Link>
          <p className="text-base text-gray-600">{item.releaseDate}</p>
        </div>
      ))}
    </div>
  );
}
