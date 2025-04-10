import { Movie } from "../types/Movie";

interface FetchMoviesResponse {
    movies: Movie[];
    totalNumMovies: number;
}

const API_URL = 'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net/api/Movie';

export const fetchMovies = async (
    pageSize: number,
    pageNum: number,
    selectedGenres: string[] = [],
    searchTerm: string = "" // ADD THIS
): Promise<FetchMoviesResponse> => {
    try {
        let url = `${API_URL}/GetMovies?pageSize=${pageSize}&pageNum=${pageNum}`;

        // Add genre filters
        if (selectedGenres.length) {
            selectedGenres.forEach(genre => {
                url += `&genreList=${encodeURIComponent(genre)}`;
            });
        }

        // Add search term
        if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',  // Include credentials (cookies)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response Error: ", errorText);
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        console.log("Parsed Data:", data);

        return {
            movies: data.movies,
            totalNumMovies: data.totalNumMovies
        };

    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

// This is CRUD stuff we will need 

export const addMovie =async (newMovie: Movie): Promise<Movie> => {
    try {
        const response = await fetch(`${API_URL}/AddMovie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
            credentials: 'include', // Include credentials (cookies)
        });

        if (!response.ok) {
            throw new Error('Failed to add movie');
        }

        return await response.json();

    } catch (error) {
        console.error('Error adding movie', error);
        throw error;
    }
};

export const updateMovie = async (show_id: string, updatedMovie: Movie): Promise<Movie> => {
    try {
        const response = await fetch(`${API_URL}/updatemovie/${show_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMovie),
            credentials: 'include', // Include credentials (cookies)
        });

        if (!response.ok) {
            throw new Error('Failed to update movie');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
};

export const deleteMovie = async (show_id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/deletemovie/${show_id}`, {
            method: 'DELETE',
            credentials: 'include', // Include credentials (cookies)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Delete response error:", errorText);
            throw new Error('Failed to delete movie');
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
};

export const fetchMovieById = async (id: string): Promise<Movie> => {
    const response = await fetch(`${API_URL}/GetMovie/${id}`, {
        credentials: 'include', // Include credentials (cookies)
    });
    if (!response.ok) {
        throw new Error('Failed to fetch movie');
    }
    return await response.json();
};

export const fetchSimilarMovies = async (show_id: string): Promise<Movie[]> => {
    try {
        const response = await fetch(`${API_URL}/GetSimilarMovies/${show_id}`, {
            credentials: 'include', // Include credentials (cookies)
        });
        if (!response.ok) {
            throw new Error('Failed to fetch similar movies');
        }
        const data = await response.json();
        return data.movies || [];
    } catch (error) {
        console.error("Error fetching similar movies:", error);
        return [];
    }
};

export const fetchAverageRating = async (show_id: string): Promise<number | null> => {
    try {
        const response = await fetch(`${API_URL}/ratings/average/${show_id}`, {
            credentials: 'include', // Include credentials (cookies)
        });
        if (!response.ok) throw new Error("Failed to fetch average rating");
        const data = await response.json();
        return data.average ?? null;
    } catch (error) {
        console.error("Error fetching average rating:", error);
        return null;
    }
};

export const fetchUserRecommendations = async (): Promise<Record<string, Movie[]>> => {
    try {
        const response = await fetch(`${API_URL}/UserRecommendations`, {
            credentials: 'include', // Include credentials (cookies)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user recommendations");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user recommendations:", error);
        throw error;
    }
};
