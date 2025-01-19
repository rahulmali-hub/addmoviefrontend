import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';

const EditDeleteMoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('/movies', { headers: { Authorization: `Bearer ${token}` } });
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  const handleEdit = (movie) => {
    setEditMovie(movie);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/movies/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMovies(movies.filter((movie) => movie._id !== id));
      alert('Movie deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to delete movie.');
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/movies/${editMovie._id}`, editMovie, { headers: { Authorization: `Bearer ${token}` } });
      setEditMovie(null);
      alert('Movie updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update movie.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Edit/Delete Movies</Typography>
      {editMovie ? (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <TextField name="name" label="Movie Name" fullWidth value={editMovie.name} onChange={(e) => setEditMovie({ ...editMovie, name: e.target.value })} />
          <TextField name="rating" label="Rating" fullWidth value={editMovie.rating} onChange={(e) => setEditMovie({ ...editMovie, rating: e.target.value })} />
          <TextField name="releaseDate" label="Release Date" fullWidth value={editMovie.releaseDate} onChange={(e) => setEditMovie({ ...editMovie, releaseDate: e.target.value })} />
          <TextField name="duration" label="Duration" fullWidth value={editMovie.duration} onChange={(e) => setEditMovie({ ...editMovie, duration: e.target.value })} />
          <Button variant="contained" color="primary" type="submit">Update Movie</Button>
        </form>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie._id}>
                <TableCell>{movie.name}</TableCell>
                <TableCell>{movie.rating}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(movie)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(movie._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default EditDeleteMoviePage;
