import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import AddRecipe from './components/AddRecipe';
import Signup from './components/Signup';
import Login from './components/Login';
import MyRecipes from './components/MyRecipes';
import SavedRecipes from './components/SavedRecipes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { RecipeProvider } from './components/RecipeContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on mount and token changes
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setIsLoggedIn(true);
      setUser({ username });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <RecipeProvider>
        <div className="App">
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route 
                path="/add-recipe" 
                element={isLoggedIn ? <AddRecipe /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/signup" 
                element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} 
              />
              <Route 
                path="/login" 
                element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/my-recipes" 
                element={isLoggedIn ? <MyRecipes user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/saved-recipes" 
                element={isLoggedIn ? <SavedRecipes /> : <Navigate to="/login" />} 
              />
            </Routes>
          </div>
        </div>
      </RecipeProvider>
    </Router>
  );
}

export default App; 