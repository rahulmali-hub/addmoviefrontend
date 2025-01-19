import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, Container, TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authenticate";
// import MovieSearch from "./Searchbyname";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const { auth } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerpage = 3;
  const lastIndex = currentPage * recordsPerpage;
  const firstIndex = lastIndex - recordsPerpage;
  const records = movies.slice(firstIndex, lastIndex);
  const npage = Math.ceil(movies.length / recordsPerpage);
  const numbers = [...Array(npage).keys()].map((n) => n + 1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/movies"); // Replace with your API endpoint
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
  

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>{error}</p>;
  //////////////// Pagination /////////////////////////

  return (
    <>
    {/* <MovieSearch/> */}
      <div
        style={{
          display: "grid",
          placeItems: "center",
          backgroundColor: "GrayText",
          width: "auto",
          marginTop:'0px',
        }}
      >
        <TableRow>
          <TableCell>
            <h1>ALL Movies List</h1>
          </TableCell>
          {!auth.token && ( // Hide the button if the user is logged in
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </TableCell>
          )}
        </TableRow>
      </div>
      <input className='searchdata' style={{ maxWidth: '400px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',height:'30px'}}
            type="text"
            aria-describedby="passwordHelpBlock"
            placeholder='Search......'
            onChange={(e)=>setsearch(e.target.value)}
          />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {records
  .filter((item) => {
    const searchLower = search.toLowerCase(); // Normalize search input
    const itemRating = item.rating ? String(item.rating) : ""; // Convert rating to string if necessary
    const itemName = item.name ? item.name.toLowerCase() : ""; // Safeguard name

    return searchLower === "" || 
           itemRating.includes(searchLower) || 
           itemName.includes(searchLower);
  })
          .map((item, index) => (
            <Card
              key={index}
              sx={{
                width: 300,
                height: 200,
                margin: "5px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Movie Name: {item.name || "No Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {item.rating || "No rating provided"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {item.duration || "No duration provided"} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Release Date:{" "}
                  {item.releaseDate || "No release date provided"}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </div>
      <Container>
        <TableRow style={{ display: "flex", width: "100%" }}>
          <ul
            className="pagination"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <li>
              <Button
                className="page-link"
                onClick={prePage}
                style={{ height: "40px", width: "50px" }}
              >
                Pre
              </Button>
            </li>
            {numbers.map((n, i) => (
              <li
                className={`page-item ${currentPage === n ? "active" : ""}`}
                key={i + 1}
              >
                <a
                  href="#"
                  className="page-link"
                  onClick={() => changeCpage(n)}
                >
                  {n}
                </a>
              </li>
            ))}
            <li>
              <Button
                className="page-link"
                onClick={nextPage}
                style={{ height: "40px", width: "50px" }}
              >
                Next
              </Button>
            </li>
          </ul>
        </TableRow>
      </Container>
    </>
  );
  function prePage() {
    if (currentPage === firstIndex + 1) {
      setCurrentPage(currentPage);
    } else if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
  function changeCpage(id) {
    setCurrentPage(id);
  }
};

export default MovieList;
