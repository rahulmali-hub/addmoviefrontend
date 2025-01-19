import React, { useState } from 'react';
import axios from 'axios';

const MovieSearch = () => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (name) => {
    try {
      const response = await axios.get(`http://localhost:5000/movies/${name}`);
      setMovies(response.data); // Update the movie list
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No movies found');
        setMovies([]); // Clear the movie list if no results
      } else {
        setError('An error occurred while searching');
      }
    }
  };

  const handleInputChange = (e) => {
    const name = e.target.value;
    setSearch(name);

    // Trigger search when user types (can be debounced for better performance)
    if (name.trim() !== '') {
      handleSearch(name);
    } else {
      setMovies([]); // Clear results if search is empty
      setError('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search movies"
        value={search}
        onChange={handleInputChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>{movie.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieSearch;
