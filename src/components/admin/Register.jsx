import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Register = () => {
    // const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
   const [username, setname]=useState("")
//    const [phone, setphone]=useState("")
   const [role, setrole]=useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // React Router hook for navigation

    const handleregister = async (e) => {
      e.preventDefault();


      try {
        // Send login credentials to the backend
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { username, password,role });

      console.log(response)

          alert('Register successful!');
          navigate('/');

          // Navigate to the Add Movie page
        

      } catch (err) {
        console.error(err);
        // Set error message based on server or network error
        if (err.response && err.response.status === 401) {
          setError('Invalid username or password');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setLoading(false);
      }
    };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleregister}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>
              Name:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setname(e.target.value)}
              required
              style={styles.input}
            />
          </div>
       
         
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="role" style={styles.label}>
              Role:
            </label>
            <select id="role" required style={styles.input}
             onChange={(e) => setrole(e.target.value)} >
              <option value="" disabled selected>
                Select Role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              
            </select>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              background: loading ? "gray" : "blue",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Register in..." : "Register"}
          </button>
        </form>
        <p>Already Registered please
        <Button onClick={()=>navigate("/login")}>login</Button>
        Here
        </p>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "1rem",
    boxSizing: "border-box",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
  },
};

export default Register;
