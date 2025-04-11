import { useState, ChangeEvent, FormEvent } from 'react';
import { Movie } from '../types/Movie';
import { updateMovie } from '../api/MoviesAPI';
import './admin-styles/EditMovieForm.css';

// Props expected by the EditMovieForm component
interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void; // callback after successful update
  onCancel: () => void;  // callback to cancel editing
  theme?: 'light' | 'dark'; // optional theme support
}

// Predefined genre options used in the dropdown
const genreOptions = [
  "Action", "Adventure", "Anime Series International TV Shows", "British TV Shows Docuseries International TV Shows",
  "Children", "Comedies", "Comedies Dramas International Movies", "Comedies International Movies",
  "Comedies Romantic Movies", "Crime TV Shows Docuseries", "Documentaries", "Documentaries International Movies",
  "Docuseries", "Dramas", "Dramas International Movies", "Dramas Romantic Movies",
  "Family Movies", "Fantasy", "Horror Movies", "International Movies Thrillers",
  "International TV Shows Romantic TV Shows TV Dramas", "Kids' TV", "Language TV Shows",
  "Musicals", "Nature TV", "Reality TV", "Spirituality", "TV Action", "TV Comedies",
  "TV Dramas", "Talk Shows TV Comedies", "Thrillers"
];

// Main component for editing a movie
const EditMovieForm = ({ movie, onSuccess, onCancel, theme = 'light' }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  // Handles change for any input or select element
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles form submission and updates movie data
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updatedData = { ...formData };

    // Add a flag for the selected genre (used by backend)
    const genreFlagKey = genreOptions.find((g) => g === formData.genres);
    if (genreFlagKey) {
      const normalizedKey = genreFlagKey.replace(/[^a-zA-Z0-9]/g, '');
      (updatedData as any)[normalizedKey] = true;
    }

    try {
      await updateMovie(formData.show_id, updatedData);
      onSuccess(); // invoke parent callback on success
    } catch (err) {
      console.error("Failed to update movie:", err);
    }
  };

  return (
    // Overlay container for modal styling
    <div className="admin-modal-overlay" onClick={onCancel} data-theme={theme}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="admin-form">
          <h2 className="admin-form-title">Edit Movie</h2>

          <div className="admin-form-sections">
            {/* Section: Basic Info */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Basic Information</h3>
              <div className="admin-form-grid">
                <label>
                  Type:
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                  </select>
                </label>

                <label>
                  Title:
                  <input type="text" name="title" value={formData.title} onChange={handleChange} />
                </label>

                <label>
                  Director:
                  <input type="text" name="director" value={formData.director} onChange={handleChange} />
                </label>

                <label>
                  Cast:
                  <input type="text" name="cast" value={formData.cast} onChange={handleChange} />
                </label>
              </div>
            </div>

            {/* Section: Metadata */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Metadata</h3>
              <div className="admin-form-grid">
                <label>
                  Country:
                  <input type="text" name="country" value={formData.country} onChange={handleChange} />
                </label>

                <label>
                  Release Year:
                  <input type="number" name="release_year" value={formData.release_year || ''} onChange={handleChange} />
                </label>

                <label>
                  Rating:
                  <input type="text" name="rating" value={formData.rating} onChange={handleChange} />
                </label>

                <label>
                  Duration:
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
                </label>
              </div>
            </div>

            {/* Section: Description */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Description</h3>
              <div className="admin-form-grid">
                <label className="admin-form-full-width">
                  Description:
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    rows={4}
                  />
                </label>
              </div>
            </div>

            {/* Section: Genre */}
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Genre</h3>
              <div className="admin-form-grid">
                <label className="admin-form-full-width">
                  Genre:
                  <select name="genres" value={formData.genres} onChange={handleChange}>
                    <option value="">Select Genre</option>
                    {genreOptions.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-add">
              Edit Movie
            </button>
            <button type="button" onClick={onCancel} className="admin-btn admin-btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieForm;
