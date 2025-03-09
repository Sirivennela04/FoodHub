import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/recipes/userRecipes/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching user recipes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username && token) {
      fetchUserRecipes();
    }
  }, [username, token]);

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
        try {
            console.log('Attempting to delete recipe with ID:', recipeId);
            const response = await fetch(`http://localhost:3001/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Delete response status:', response.status);

            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const responseBody = await response.json();
                    throw new Error(responseBody.message || 'Failed to delete recipe');
                } else {
                    throw new Error(`Unexpected response: ${response.statusText}`);
                }
            }

            setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        } catch (err) {
            console.error('Error deleting recipe:', err);
            setError(err.message);
        }
    }
};


  if (!username || !token) {
    return (
      <div className="alert alert-warning">
        Please <Link to="/login">log in</Link> to see your recipes.
      </div>
    );
  }

  if (loading) {
    return <div>Loading your recipes...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Recipes</h2>
      {recipes.length === 0 ? (
        <div className="alert alert-info">
          You haven't added any recipes yet. <Link to="/add-recipe">Add your first recipe!</Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="col">
              <div className="card h-100">
                <img src={recipe.imageUrl} className="card-img-top" alt={recipe.name} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text">
                    <small className="text-muted">Cooking Time: {recipe.cookingTime} minutes</small>
                  </p>
                  <Link to={`/recipe/${recipe._id}`} className="btn btn-primary">
                    View Recipe
                  </Link>
                  <button onClick={() => handleDelete(recipe._id)} className="btn btn-danger ms-2">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipes; 