import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const DeleteMoviePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get('/movies'); // Replace with your backend URL
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/movies/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id));
      alert('Movie deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to delete movie.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Delete Movies</Typography>
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
                <Button variant="contained" color="secondary" onClick={() => handleDelete(movie._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default DeleteMoviePage;
