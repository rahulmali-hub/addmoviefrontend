import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Authenticate';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext); // Use auth from context

  return auth.token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
