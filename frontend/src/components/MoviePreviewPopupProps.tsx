import React from 'react';
import './magnific-popup.css'; // Your existing popup styles
import './MoviePopup.css'; // Shared styles for both popups

type MoviePreviewPopupProps = {
  open: boolean;
  onClose: () => void;
  selectedMovie: any;
};

const MoviePreviewPopup: React.FC<MoviePreviewPopupProps> = ({ open, onClose, selectedMovie }) => {
  if (!open) return null;

  const posterUrl = `https://moviepostersforintex.blob.core.windows.net/movieposters/${encodeURIComponent(selectedMovie?.title)}.jpg`;

  return (
    <>
      <div className="mfp-bg" onClick={onClose}></div>
      <div className="mfp-wrap" onClick={onClose}>
        <div
          className="mfp-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mfp-content movie-popup animate-popup">
            <button className="mfp-close" onClick={onClose}>
              ✕
            </button>

            <div className="movie-popup-content">
              <h2>{selectedMovie?.title}</h2>
              <img 
                src={posterUrl} 
                alt={selectedMovie?.title}
                className="movie-poster"
                loading="lazy"
                onError={(e) => (e.currentTarget as HTMLImageElement).src = "/Click.jpg"} // Default image on error
              />
              <p>{selectedMovie?.description}</p>
              <p><strong>Genre:</strong> {selectedMovie?.genres}</p>
              <p><strong>Release Year:</strong> {selectedMovie?.release_year}</p>
              <p><strong>Director:</strong> {selectedMovie?.director}</p>
              <p><strong>Country:</strong> {selectedMovie?.country}</p>
              <p><strong>Cast:</strong> {selectedMovie?.cast}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviePreviewPopup;