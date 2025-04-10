import { useEffect, useState, useRef } from "react";
import { Movie } from '../types/Movie';
import { fetchUserRecommendations, fetchSimilarMovies } from "../api/MoviesAPI";
import MoviePopup from '../components/MoviePopup';
import ReactStars from "react-rating-stars-component";
import StarRating from "../components/StarRating";
import AuthorizedHeader from "../components/AuthorizedHeader";
import AuthorizeView from "../components/AuthorizeView";

const sanitizeTitle = (title: string): string => {
    return title
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

const imageExists = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

function UserRecommendations() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [hasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [groupedMovies, setGroupedMovies] = useState<Record<string, Movie[]>>({});



    const getGenreList = (movie: Movie): string => {
        const alwaysUpper = new Set(["TV", "ID", "USA", "UK"]);
        const splitCamelCase = (text: string): string[] => {
            const result: string[] = [];
            let word = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
                if (isUpper && word.length > 0 && text[i - 1] !== text[i - 1].toUpperCase()) {
                    result.push(word);
                    word = char;
                } else {
                    word += char;
                }
            }
            if (word) result.push(word);
            return result;
        };
        return Object.entries(movie)
            .filter(([, value]) => typeof value === "boolean" && value === true)
            .map(([key]) => {
                const parts = splitCamelCase(key);
                return parts.map(word => alwaysUpper.has(word.toUpperCase())
                    ? word.toUpperCase()
                    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            }).join(', ');
    };

    const seenTitles = useRef<Set<string>>(new Set());
    const seenImages = useRef<Set<string>>(new Set());


    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                const recommendationGroups = await fetchUserRecommendations(); // { Action: [...], Dramas: [...], etc. }
    
                const grouped: Record<string, Movie[]> = {};
                const allMovies: Movie[] = [];
    
                for (const [genre, movies] of Object.entries(recommendationGroups)) {
                    const filtered: Movie[] = [];
    
                    for (const movie of movies) {
                        const title = sanitizeTitle(movie.title);
                        const imageUrl = `https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(title)}.jpg`;
                        if (seenTitles.current.has(movie.title) || seenImages.current.has(imageUrl)) continue;
                        const exists = await imageExists(imageUrl);
                        if (!exists) continue;
                        seenTitles.current.add(movie.title);
                        seenImages.current.add(imageUrl);
                        filtered.push(movie);
                        allMovies.push(movie);
                    }
    
                    grouped[genre] = filtered;
                }
    
                setGroupedMovies(grouped);
    
                if (allMovies.length) {
                    const randomIndex = Math.floor(Math.random() * allMovies.length);
                    setFeaturedMovie(allMovies[randomIndex]);
                }
    
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
    
        loadMovies();
    }, []);
    

    useEffect(() => {
        const fetchAverageRating = async () => {
            if (!selectedMovie) return;
            try {
                const res = await fetch(`https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net/api/Movie/ratings/average/${selectedMovie.show_id}`);
                const data = await res.json();
                setAverageRating(data?.average ?? null);
            } catch {
                setAverageRating(null);
            }
        };

        const fetchSimilar = async () => {
            if (!selectedMovie) return;
            try {
                const sims = await fetchSimilarMovies(selectedMovie.show_id);
                setSimilarMovies(sims);
            } catch {
                setSimilarMovies([]);
            }
        };

        fetchAverageRating();
        fetchSimilar();
    }, [selectedMovie]);

    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <>
            <AuthorizeView>
            <AuthorizedHeader/>
            <br />
            <h1 style={{ color: 'black', textAlign: 'center', fontSize: '2rem', margin: '1.5rem 0' }}>
                Based on your viewing history
            </h1>
            <div style={{ margin: "2rem" }}>
            </div>
            {featuredMovie && (
                <div style={{ backgroundColor: '#333', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'flex-start' }}>
                    <img
                        src={`https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(sanitizeTitle(featuredMovie.title))}.jpg`}
                        alt={featuredMovie.title}
                        style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                        onError={(e) => (e.currentTarget as HTMLImageElement).src = "/Click.jpg"}
                    />
                    <div style={{ marginLeft: '20px', maxWidth: '60%', textAlign: 'left' }}>
                        <h2>Featured Movie:</h2>
                        <h3>{featuredMovie.title} ({featuredMovie.release_year})</h3>
                        <p><strong>Rating:</strong> {featuredMovie.rating}</p>
                        <p><strong>Description:</strong> {featuredMovie.description}</p>
                        <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#ff8c00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            See Details
                        </button>
                    </div>
                </div>
            )}

            {Object.entries(groupedMovies).map(([genre, movies]) => (
            <div key={genre} style={{ marginBottom: '3rem' }}>
                <h2
                    style={{
                        color: '#000000',
                        marginLeft: '1.5rem',
                        marginBottom: '1rem',
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        textAlign: 'left',
                    }}
                    >
                    {genre}
                </h2>

                <div
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '16px',
                    padding: '0 1.5rem',
                    scrollbarWidth: 'none' // for Firefox
                }}
                >
                {movies.map((m) => {
                    const sanitizedTitle = sanitizeTitle(m.title);
                    const imageUrl = `https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(sanitizedTitle)}.jpg`;
                    return (
                    <div
                        key={m.show_id}
                        style={{
                        flex: '0 0 auto',
                        width: '200px',
                        height: '300px',
                        backgroundColor: '#1F1F1F',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        cursor: 'pointer'
                        }}
                        onClick={() => setSelectedMovie(m)}
                        onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
                        const overlay = (e.currentTarget as HTMLDivElement).querySelector('.overlay') as HTMLDivElement;
                        if (overlay) overlay.style.opacity = '1';
                        }}
                        onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                        const overlay = (e.currentTarget as HTMLDivElement).querySelector('.overlay') as HTMLDivElement;
                        if (overlay) overlay.style.opacity = '0';
                        }}
                    >
                        <img
                        src={imageUrl}
                        alt={m.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => (e.currentTarget as HTMLImageElement).src = "/Click.jpg"}
                        />
                        <div className="overlay" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        fontSize: '14px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                        }}>
                        {m.title}
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
            ))}



            {selectedMovie && (
                <MoviePopup open={!!selectedMovie} onClose={() => setSelectedMovie(null)}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <img
                            src={`https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(sanitizeTitle(selectedMovie.title))}.jpg`}
                            alt={selectedMovie.title}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
                            onError={(e) => (e.currentTarget as HTMLImageElement).src = "/Click.jpg"}
                        />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), rgba(0,0,0,0))', color: 'white', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedMovie.title}</h2>
                            <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>{selectedMovie.release_year} • {selectedMovie.rating} • {getGenreList(selectedMovie)}</p>
                            {averageRating !== null ? (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                                    Average Rating
                                    </h3>
                                    <ReactStars
                                    key={`avg-${selectedMovie?.show_id}-${averageRating}`}
                                    count={5}
                                    value={averageRating}
                                    edit={false}
                                    size={30}
                                    activeColor="#00CED1"
                                    />
                                    <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#FFD700' }}>
                                    {averageRating.toFixed(1)} ★
                                    </p>
                                </div>
                                ) : (
                                <p style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.7 }}>
                                    This movie hasn’t been rated yet.
                                </p>
                                )}
                        </div>
                    </div>
                    <div className="text-white mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '2 1 60%' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Summary</h3>
                                <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{selectedMovie.description}</p>
                                <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                                    <p><strong>Director:</strong> {selectedMovie.director}</p>
                                    <p><strong>Country:</strong> {selectedMovie.country}</p>
                                </div>
                            </div>
                            <div style={{ flex: '1 1 35%' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cast</h3>
                                <p style={{ marginBottom: '1rem' }}>{selectedMovie.cast}</p>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Genres</h3>
                                <p>{getGenreList(selectedMovie)}</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Your Rating</h3>
                        <StarRating />

                    </div>


                        {similarMovies.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>More Like This</h3>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {similarMovies.map((movie) => (
                                        <div
                                            key={movie.show_id}
                                            style={{ width: '150px', height: '225px', backgroundColor: '#1F1F1F', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}
                                            onClick={() => setSelectedMovie(movie)}
                                        >
                                            <img
                                                src={`https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(sanitizeTitle(movie.title))}.jpg`}
                                                alt={movie.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => (e.currentTarget as HTMLImageElement).src = "/Click.jpg"}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </MoviePopup>
            )}

            {loading && <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc' }}>Loading more movies...</p>}
            {!hasMore && <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc' }}>No more movies to load.</p>}
            </AuthorizeView>
        </>
    );
}

export default UserRecommendations;