import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    imageUrl: '',
    cookingTime: '',
    cuisine: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('https://food-hub-server-git-main-sirivennelas-projects-9dbaf9e3.vercel.app/recipes', 
        {
          ...recipe,
          ingredients: recipe.ingredients.split(',').map(i => i.trim())
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (response.status === 201) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create New Recipe</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Recipe Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={recipe.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ingredients (comma-separated)</label>
                  <textarea
                    className="form-control"
                    name="ingredients"
                    value={recipe.ingredients}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Instructions</label>
                  <textarea
                    className="form-control"
                    name="instructions"
                    value={recipe.instructions}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imageUrl"
                    value={recipe.imageUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cooking Time (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="cookingTime"
                    value={recipe.cookingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cuisine</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cuisine"
                    value={recipe.cuisine}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Create Recipe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipe; 