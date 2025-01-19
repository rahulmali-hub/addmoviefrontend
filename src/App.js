import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from './components/context/Authenticate';



import LoginPage from './components/admin/Adminlogin';
import AddMoviePage from './components/admin/Addmovie';

import MovieList from './components/admin/Getmovies';
import MiniDrawer from './components/dashboard/Dashboard';

function App() {
  const { auth } = useContext(AuthContext); // Use AuthContext to get authentication state
  const isAuth = !!auth.token; // Check if token exists

  return (
    <BrowserRouter>
 
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        if({isAuth}){
          
          <Route path="/home" element={<MiniDrawer />} >
              <Route index element={<AddMoviePage />} />

        {/* Private Routes */}
        <Route
          path="add"
          element={<AddMoviePage />}
        />
      
        <Route
          path="allMovies"
          element={<MovieList />}
        />
        </Route>

}
          <Route
            path="/"
            element={<MovieList />}
          />
      </Routes>
   
    </BrowserRouter>
  );
}

export default App;
