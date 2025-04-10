import { useEffect, useState } from "react";

function GenreFilter({
  selectedGenres,
  setSelectedGenres,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net/api/Movie/GetGenres',
          {
            method: 'GET',
            credentials: 'include'
          }
        );
        const data = await response.json();
        console.log('Fetched Genres:', data);
        setGenres(data);
      } catch (error) {
        console.error('Error fetching Genres', error);
      }
    };

    fetchGenres();
  }, []);

  // Handle single selection
  function handleDropdownChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedGenre = event.target.value;
    setSelectedGenres(selectedGenre ? [selectedGenre] : []);
  }

  return (
    <div className="category-filter">
      <h5>Genre</h5>
      <div className="category-dropdown">
        <select
          value={selectedGenres[0] || ""}
          onChange={handleDropdownChange}
          className="category-select"
        >
          <option value="">Select a Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default GenreFilter;
