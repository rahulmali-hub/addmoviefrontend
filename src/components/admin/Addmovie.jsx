

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
    image: null, // To store the uploaded image
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies`);
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
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setMovie({ ...movie, image: files[0] }); // Handle image files
    } else {
      setMovie({ ...movie, [name]: value });
    }
  };

  // Add Movie API Call
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const formData = new FormData();
      for (const key in movie) {
        formData.append(key, movie[key]);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure the server expects form data
        },
      });

      alert("Movie added successfully!");
      fetchMovies(); // Refresh movie list
      setOpenAddModal(false); // Close the modal
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(`Failed to add movie: ${error.response.data.message}`);
      } else {
        alert("Failed to add movie due to a network or server error.");
      }
    }
  };

  // Edit Movie API Call
  const handleEditMovie = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const formData = new FormData();
      for (const key in movie) {
        formData.append(key, movie[key]);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/movies/${movie.movieId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure the server expects form data
          },
        }
      );

      alert("Movie updated successfully!");
      fetchMovies(); // Refresh movie list
      setOpenEditModal(false); // Close the modal
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(`Failed to update movie: ${error.response.data.message}`);
      } else {
        alert("Failed to update movie due to a network or server error.");
      }
    }
  };

  // Delete Movie API Call
  const handleDelete = async (movieId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }
      await axios.delete(`${process.env.REACT_APP_API_URL}/movies/${movieId}`, {
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

  // Handle modal open/close
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenEditModal = (movieId) => {
    const movieToEdit = movies.find((movie) => movie.movieId === movieId);
    setMovie(movieToEdit);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => setOpenEditModal(false);

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
        <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
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
                    onClick={() => handleOpenEditModal(movie.movieId)}
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
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" style={{ marginBottom: "20px" }}>
            Add Movie
          </Typography>
          <form onSubmit={handleAddMovie}>
            <TextField
              name="movieId"
              label="Movie Id"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
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
            {/* Image Upload Field */}
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{ marginBottom: "16px" }}
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
                onClick={handleCloseAddModal}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" style={{ marginBottom: "20px" }}>
            Edit Movie Details
          </Typography>
          <form onSubmit={handleEditMovie}>
            <TextField
              name="movieId"
              label="Movie Id"
              fullWidth
              margin="normal"
              value={movie.movieId}
              onChange={handleChange}
              disabled
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
            {/* Image Upload Field */}
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{ marginBottom: "16px" }}
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
                onClick={handleCloseEditModal}
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
