import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  console.log('Token:', token);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://food-hub-server-git-main-sirivennelas-projects-9dbaf9e3.vercel.app/recipes/saved', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          throw new Error('Failed to fetch saved recipes');
        }

        console.log('User found:', data);

        setRecipes(data);
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSavedRecipes();
    }
  }, [token]);

  const handleUnsave = async (recipeId) => {
    try {
      const response = await fetch(`https://food-hub-server-git-main-sirivennelas-projects-9dbaf9e3.vercel.app/recipes/save/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unsave recipe');
      }

      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      console.error('Error unsaving recipe:', err);
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="alert alert-warning">
        Please <Link to="/login">log in</Link> to see your saved recipes.
      </div>
    );
  }

  if (loading) {
    return <div>Loading your saved recipes...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Saved Recipes</h2>
      {recipes.length === 0 ? (
        <div className="alert alert-info">
          You haven't saved any recipes yet. <Link to="/recipes">Browse recipes</Link> to find some!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="col">
              <div className="card h-100">
                <img 
                  src={recipe.imageUrl} 
                  className="card-img-top" 
                  alt={recipe.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text">
                    <small className="text-muted">
                      {recipe.cuisine} • {recipe.cookingTime} minutes
                      <br />
                      Shared by: {recipe.userOwner}
                    </small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/recipe/${recipe._id}`} className="btn btn-primary">
                      View Recipe
                    </Link>
                    <button 
                      onClick={() => handleUnsave(recipe._id)}
                      className="btn btn-outline-danger"
                    >
                      Unsave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedRecipes; 