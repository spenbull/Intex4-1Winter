import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { fetchMovies } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
import MoviePreviewPopup from '../components/MoviePreviewPopupProps' // Import the preview popup
import './LandingPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sanitizeTitle = (title: string): string => {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Simulate being logged in for testing purposes
const isLoggedIn = false; // Change to `false` for testing restricted access

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Track selected movie
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const loadFeatured = async () => {
      try {
        const data = await fetchMovies(20, 1, [], '');
        if (Array.isArray(data.movies)) {
          setFeaturedMovies(data.movies);
        }
      } catch (err) {
        console.error('Failed to fetch featured movies:', err);
      }
    };

    loadFeatured();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleGetStarted = () => {
    navigate('/sign-up', { state: { email } });
  };

  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    focusOnSelect: true,
    draggable: true,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
      <div className="login-button-wrapper">
        <button
          className="login-button"
          onClick={() => navigate('/login')}
          aria-label="Log in"
        >
          Log In
        </button>
      </div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Stream Bold. Discover Niche.</h1>
            <p className="hero-subtitle">Your Home for Underrated Cinema</p>
          </div>
          <div className="cta-container">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="email-input"
              aria-label="Email address"
            />
            <button 
              className="cta-button"
              onClick={handleGetStarted}
              aria-label="Get Started"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="featured-content">
          <h2 className="section-title">Featured Originals</h2>
          <Slider {...settings} className="movie-carousel">
            {featuredMovies.map((movie) => {
              const posterUrl = `https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(sanitizeTitle(movie.title))}.jpg`;
              return (
                <div key={movie.show_id} className="movie-slide" onClick={() => setSelectedMovie(movie)}>
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                    onError={(e) => (e.currentTarget as HTMLImageElement).src = "/Click.jpg"}
                  />
                </div>
              );
            })}
          </Slider>
        </div>
      </section>

      {/* Brand Section */}
      <section className="brand-section">
        <div className="brand-content">
          <h2 className="brand-title">CineNiche</h2>
          <p className="brand-tagline">Curated Cinema for the Discerning Viewer</p>
        </div>
      </section>

      {/* Show preview popup for non-logged-in users */}
      {selectedMovie && !isLoggedIn && (
        <MoviePreviewPopup 
          open={!!selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          selectedMovie={selectedMovie}
        />
      )}

    </div>
  );
};

export default LandingPage;