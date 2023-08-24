
import Link from 'next/link';
import HomePage from './home/page'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Link href="/search">
        Go to Search
      </Link>
      <HomePage />
    </main>
  )
}
