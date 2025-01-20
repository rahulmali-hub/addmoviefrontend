import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, Container, MenuItem, Select, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authenticate";
import moment from "moment";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { auth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const [sortBy, setSortBy] = useState("");  // State to track sorting criteria
  const [sortOption, setSortOption] = useState("name"); // Default sorting by namesort

  useEffect(() => {
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

    fetchMovies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredMovies = movies.filter((movie) => {
    const searchLower = search.toLowerCase();
    const movieName = movie.name ? movie.name.toLowerCase() : "";
    return searchLower === "" || movieName.includes(searchLower);
  });

  // Sorting logic based on `sortBy` state
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    const sortedMovies = [...movies].sort((a, b) => {
      if (selectedOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (selectedOption === "rating") {
        return (b.rating || 0) - (a.rating || 0); // Higher ratings first
      }
      return 0;
    });

    setMovies(sortedMovies);
  };

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredMovies.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredMovies.length / recordsPerPage);
  const numbers = [...Array(npage).keys()].map((n) => n + 1);

  function prePage() {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  }

  function nextPage() {
    if (currentPage === npage) return;
    setCurrentPage(currentPage + 1);
  }

  function changePage(id) {
    setCurrentPage(id);
  }

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          backgroundColor: "#f5f5f5",
          width: "100%",
          padding: "20px 0",
        }}
      >
        <TableRow>
          <TableCell>
            <h1 style={{ color: "#333", fontSize: "2rem", fontWeight: "600",color:"#019EF3" }}>
              ALL Movies List
            </h1>
          </TableCell>
          {!auth.token && (
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: "#007bff",
                  padding: "8px 20px",
                  color: "white",
                  fontWeight: "500",
                  textTransform: "none",
                  borderRadius: "5px",
                }}
              >
                Login
              </Button>
            </TableCell>
          )}
        </TableRow>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          className="searchdata"
          style={{
            marginTop: "10px",
            maxWidth: "400px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            height: "40px",
            paddingLeft: "15px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          type="text"
          placeholder="Search by movie name..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={sortOption}
          onChange={handleSortChange}
          displayEmpty
          style={{ height: "30px", marginLeft: "1rem" }}
        >
          <MenuItem value="name">Sort by Name</MenuItem>
          <MenuItem value="rating">Sort by Rating</MenuItem>
        </Select>
      </div>

    

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {records.map((item, index) => (
          <Card
            key={index}
            sx={{
              width: 300,
              height: 250,
              margin: "10px",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "8px",
              overflow: "hidden",
            }}
            style={{ backgroundColor: "#fff" }}
          >
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "navy",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {item.image && <img src={`http://localhost:5000/${item.image}`} alt={item.name} style={{ borderRadius: '2rem', height: '5rem', width: '7rem' }} />}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                style={{
                  marginTop: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "navy",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {item.name || "No Name"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ marginBottom: "5px", marginTop: "10px", color: "#006400" }}
              >
                <strong>Rating:</strong> {item.rating || "No rating provided"}
                <span style={{ color: "#006400", fontSize: "12px" }}>{'⭐'.repeat(item.rating)}</span>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ marginBottom: "5px", marginTop: "10px", color: "#006400" }}
              >
                <strong>Duration:</strong> {item.duration || "No duration provided"} minutes
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              
              >
                <strong>Release Date:</strong> {moment(item.releaseDate || "No release date provided").format("DD-MM-YYYY")}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Container>
        <TableRow style={{ display: "flex", width: "100%" }}>
          <ul
            className="pagination"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: "0",
              margin: "0",
              listStyle: "none",
            }}
          >
            <li>
              <Button
                className="page-link"
                onClick={prePage}
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#007bff",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0",
                  borderRadius: "5px",
                  marginRight: "2px",
                }}
              >
                Prev
              </Button>
            </li>
            {numbers.map((n, i) => (
              <li key={i + 1} style={{ listStyle: "none", marginRight: "5px" }}>
                <a
                  href=""
                  onClick={() => changePage(n)}
                  style={{
                    display: "block",
                    padding: "7px 10px",
                    backgroundColor: currentPage === n ? "#007bff" : "transparent",
                    color: currentPage === n ? "white" : "#007bff",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "300",
                  }}
                >
                  {n}
                </a>
              </li>
            ))}
            <li>
              <Button
                className="page-link"
                onClick={nextPage}
                style={{
                  height: "30px",
                  width: "30px",
                  backgroundColor: "#007bff",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0",
                  borderRadius: "5px",
                }}
              >
                Next
              </Button>
            </li>
          </ul>
        </TableRow>
      </Container>
    </>
  );
};

export default MovieList;
