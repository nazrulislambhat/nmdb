
import Index from './pages'
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Link href="/search">
        Go to Search
      </Link>
      <Index />
    </main>
  )
}
