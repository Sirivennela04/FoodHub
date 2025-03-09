import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RecipeContext } from './RecipeContext';

function RecipeList() {
  const { recipes, loading, error, fetchRecipes } = useContext(RecipeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const memoizedFetchRecipes = useCallback(fetchRecipes, [fetchRecipes]);

  useEffect(() => {
    memoizedFetchRecipes();
  }, [memoizedFetchRecipes]);

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading recipes...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Recipes</h2>
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="row">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search Recipes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" type="submit">Search</button>
          </div>
        </div>
      </form>
      
      {filteredRecipes.length === 0 ? (
        <div className="text-center mt-5">
          <p>No recipes found. Be the first to share a recipe!</p>
          <Link to="/add-recipe" className="btn btn-primary">Share a Recipe</Link>
        </div>
      ) : (
        <div className="row">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img 
                  src={recipe.imageUrl} 
                  className="card-img-top" 
                  alt={recipe.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text">
                    <small className="text-muted">
                      {recipe.cuisine} • {recipe.cookingTime} minutes
                    </small>
                  </p>
                  <p className="card-text">
                    {recipe.ingredients.slice(0, 3).join(', ')}
                    {recipe.ingredients.length > 3 && '...'}
                  </p>
                  <Link to={`/recipe/${recipe._id}`} className="btn btn-primary">
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;