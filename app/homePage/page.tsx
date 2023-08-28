import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import TrendingMovies from '../components/TrendingMovies/TrendingMovies';
import CTABanner from '../components/CTABanner/CTABanner';
export default function Index() {
  const extrasList = [
    'Enjoy TMDB ad free',
    'Maintain a personal watchlist',
    "Log the movies and TV shows you've seen",
    'Build custom lists',
    'Contribute to and improve our database',
  ];

  return (
    <div>
      <Header />
      <div className=" max-w-[1300px] mx-auto">
        <HeroSection
          title="Welcome"
          subtitle="Millions of movies, TV shows and people to discover. Explore now."
        />
        <TrendingMovies />
        <LatestTrailers />
        <CTABanner
          title="Join Today"
          subtitle="Get access to maintain your own custom personal lists, track what you've seen and search and filter for what to watch next—regardless if it's in theatres, on TV or available on popular streaming services like Netflix, Amazon Prime Video, Max Amazon Channel, DisneyPlus, and Apple TV Plus."
          extras={extrasList}
        />
      </div>
      <Footer />
    </div>
  );
}
