import { useEffect, useRef, useState } from 'react';
import { Movie } from '../types/Movie';
import {
  fetchMovies,
  deleteMovie
} from '../api/MoviesAPI';
import Pagination from '../components/pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import AuthorizeView from '../components/AuthorizeView';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const editFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(pageSize, pageNum, [], '');
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum]);

  // Scroll to top of edit form when editingMovie is set
  useEffect(() => {
    if (editingMovie && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [editingMovie]);

  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?',
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(show_id);
      setMovies(movies.filter((m) => m.show_id !== show_id));
    } catch (error) {
      alert('Failed to delete movie. Please try again.');
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className='text-red-500'>Error: {error}</p>;

  return (
    <AuthorizeView>
    <div>
      <h1>Admin - Movies</h1>

      {!showForm && (
        <button
          className='btn btn-success mb-3'
          onClick={() => {
            setEditingMovie(null);
            setShowForm(true);
          }}
        >
          Add Movie
        </button>
      )}

      {showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNum, [], '').then((data) =>
              setMovies(data.movies),
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <div ref={editFormRef}>
          <EditMovieForm
            movie={editingMovie}
            onSuccess={() => {
              setEditingMovie(null);
              fetchMovies(pageSize, pageNum, [], '').then((data) =>
                setMovies(data.movies),
              );
            }}
            onCancel={() => setEditingMovie(null)}
          />
        </div>
      )}

      <table className='table table-bordered table-striped'>
        <thead className='table-dark'>
          <tr>
            <th>Show ID </th>
            <th>Type</th>
            <th>Title</th>
            <th>Director</th>
            <th>Cast</th>
            <th>Country</th>
            <th>Release Year</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Genres</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.show_id}>
              <td>{m.show_id}</td>
              <td>{m.type}</td>
              <td>{m.title}</td>
              <td>{m.director}</td>
              <td>{m.cast}</td>
              <td>{m.country}</td>
              <td>{m.release_year}</td>
              <td>{m.rating}</td>
              <td>{m.duration}</td>
              <td>{m.description}</td>
              <td>
                {Object.entries(m)
                  .filter(([_, value]) => typeof value === 'boolean' && value === true)
                  .map(([genre]) => genre)
                  .join(', ')}
              </td>
              <td>
                <button
                  className='btn btn-primary btn-sm w-100 mb-1'
                  onClick={() => {
                    console.log("CLICKED:", m);
                    setShowForm(false);
                    setEditingMovie(m);
                  }}
                >
                  Edit
                </button>
                <button
                  className='btn btn-danger btn-sm w-100'
                  onClick={() => handleDelete(m.show_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
    </AuthorizeView>
  );
};

export default AdminMoviesPage;
