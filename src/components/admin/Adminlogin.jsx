import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // React Router hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send login credentials to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });

      if (response.status === 200) {
        const { token } = response.data;
       
          
         

          
        // Save the token in sessionStorage
        sessionStorage.setItem('token', token);

        // alert('Login successful!');
        navigate('/home');
        setLoading(false);

        // Navigate to the Add Movie page
      } else {
        // Handle unexpected status codes
        setError('Unexpected error. Please try again.');
        setLoading(false);
      }
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
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            background: loading ? 'gray' : 'blue',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>Create your Account
      <Button onClick={()=>navigate("/register")}>Register</Button>
      </p>
    </div>
  </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};

export default LoginPage;
