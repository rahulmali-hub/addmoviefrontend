import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
} from "@mui/material";
import axios from "axios";

const AddMoviePage = () => {
  const [movie, setMovie] = useState({
    movieId: "",
    name: "",
    rating: "",
    releaseDate: "",
    duration: "",
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/movies");
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch movies");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      // If movieId exists, update the movie
      if (movie.movieId) {
        await axios.put(
          `http://localhost:5000/movies/${movie.movieId}`,
          movie,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Movie updated successfully!");
      } else {
        // Add new movie
        await axios.post(
          "http://localhost:5000/movies",
          movie,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Movie added successfully!");
      }

      fetchMovies(); // Refresh movie list after adding or updating
      setOpen(false); // Close the modal after submission
      setOpen1(false); // Close the modal after submission
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(`Failed to process movie: ${error.response.data.message}`);
      } else {
        alert("Failed to process movie due to a network or server error.");
      }
    }
  };

  const handleDelete = async (movieId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }
      await axios.delete(`http://localhost:5000/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(movies.filter((movie) => movie.movieId !== movieId));
      alert("Movie deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete movie.");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Edit modal open and close
  const handleOpen1 = (movieId) => {
    const movieToEdit = movies.find((movie) => movie.movieId === movieId);
    setMovie(movieToEdit);
    setOpen1(true);
  };
  const handleClose1 = () => setOpen1(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>
        Movie Management
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Movie
        </Button>
      </div>

      {/* Movie Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Duration (mins)</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie, index) => (
              <TableRow key={index}>
                <TableCell>{movie.name || "N/A"}</TableCell>
                <TableCell>{movie.rating || "N/A"}</TableCell>
                <TableCell>{movie.duration || "N/A"}</TableCell>
                <TableCell>{movie.releaseDate || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(movie.movieId)}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpen1(movie.movieId)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Movie Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            component="h2"
            style={{ marginBottom: "20px" }}
          >
            Add Movie
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Movie Name"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              name="rating"
              label="Rating"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              type="date"
              name="releaseDate"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              name="duration"
              label="Duration (mins)"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal open={open1} onClose={handleClose1}>
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            component="h2"
            style={{ marginBottom: "20px" }}
          >
            Edit Movie Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="movieId"
              label="Movie Id"
              fullWidth
              margin="normal"
              value={movie.movieId}
              onChange={handleChange}
              required
            />
            <TextField
              name="name"
              label="Movie Name"
              fullWidth
              margin="normal"
              value={movie.name}
              onChange={handleChange}
              required
            />
            <TextField
              name="rating"
              label="Rating"
              fullWidth
              margin="normal"
              value={movie.rating}
              onChange={handleChange}
              required
            />
            <TextField
              type="date"
              name="releaseDate"
              fullWidth
              margin="normal"
              value={movie.releaseDate}
              onChange={handleChange}
              required
            />
            <TextField
              name="duration"
              label="Duration (mins)"
              fullWidth
              margin="normal"
              value={movie.duration}
              onChange={handleChange}
              required
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose1}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default AddMoviePage;
