import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import LatestTrailers from '../components/LatestTrailers/LatestTrailers';
import TrendingMovies from '../components/TrendingMovies/TrendingMovies';
export default function Index() {
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
      </div>
      <Footer />
    </div>
  );
}
