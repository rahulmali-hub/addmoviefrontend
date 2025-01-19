import React, { createContext, useState } from 'react';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: sessionStorage.getItem('token') || null });

  const login = (token) => {
    sessionStorage.setItem('token', token);
    setAuth({ token });
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setAuth({ token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
