import React, { useEffect, useState } from "react";
import { Container, Button, Table, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import moment from "moment";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/post`, movie, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      alert("Movie added successfully!");
      fetchMovies();
      setShowAddModal(false);
    } catch (error) {
      alert("Failed to add movie.");
    }
  };

  const handleEditMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/movies/${movie.movieId}`, movie, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      alert("Movie updated successfully!");
      fetchMovies();
      setShowEditModal(false);
    } catch (error) {
      alert("Failed to update movie.");
    }
  };

  const handleDelete = async (movieId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setMovies(movies.filter((m) => m.movieId !== movieId));
      alert("Movie deleted successfully!");
    } catch (error) {
      alert("Failed to delete movie.");
    }
  };

  return (
    <Container>
      <h2 className="my-3">Movie Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button className="mb-3" onClick={() => setShowAddModal(true)}>Add Movie</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Movie Name</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.movieId}>
              <td>{movie.name}</td>
              <td>{movie.rating}</td>
              <td>{movie.duration}</td>
              <td>{moment(movie.releaseDate).format('DD-MM-YYYY')}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => { setMovie(movie); setShowEditModal(true); }}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(movie.movieId)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Movie Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} style={{ marginTop: "3%" }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditMovie}>
            <Form.Group className="mb-3">
              <Form.Label>Movie Name</Form.Label>
              <Form.Control name="name" value={movie.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control name="rating" value={movie.rating} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control type="date" name="releaseDate" value={movie.releaseDate} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control name="duration" value={movie.duration} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit">Update</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Movie Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} style={{ marginTop: "3%" }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMovie}>
          <Form.Group className="mb-3">
              
              <Form.Label>Movie Id</Form.Label>
              <Form.Control name="movieId" onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              
              <Form.Label>Movie Name</Form.Label>
              <Form.Control name="name" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control name="rating" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control type="date" name="releaseDate" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control name="duration" onChange={handleChange} required />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AddMoviePage;
