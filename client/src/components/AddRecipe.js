import React, { useState, useContext } from 'react';
import { RecipeContext } from './RecipeContext';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const { addRecipe } = useContext(RecipeContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    cuisine: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    cookingTime: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ingredients') {
      setRecipe({ 
        ...recipe, 
        [name]: value.split(',').map(item => item.trim()).filter(item => item)
      });
    } else if (name === 'instructions') {
      setRecipe({ ...recipe, [name]: value });
    } else if (name === 'cookingTime') {
      setRecipe({ ...recipe, [name]: parseInt(value) || 0 });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let formattedInstructions = recipe.instructions;
      if (!formattedInstructions.match(/^\d+\./m)) {
        formattedInstructions = recipe.instructions
          .split(/\n+/)
          .filter(step => step.trim())
          .map((step, index) => `${index + 1}. ${step.trim()}`)
          .join('\n');
      }

      const result = await addRecipe({
        ...recipe,
        instructions: formattedInstructions
      });
      
      if (result) {
        navigate('/my-recipes');
      }
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err.message || 'Failed to add recipe. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Share Your Recipe</h2>
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
                  <label className="form-label">Cuisine Type</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cuisine"
                    value={recipe.cuisine}
                    onChange={handleChange}
                    placeholder="e.g., Italian, Indian, Mexican"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ingredients (comma separated)</label>
                  <textarea
                    className="form-control"
                    name="ingredients"
                    value={recipe.ingredients.join(', ')}
                    onChange={handleChange}
                    placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs"
                    rows="3"
                    required
                  />
                  <small className="text-muted">Separate ingredients with commas</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Instructions</label>
                  <textarea
                    className="form-control"
                    name="instructions"
                    value={recipe.instructions}
                    onChange={handleChange}
                    placeholder="Enter each step on a new line. They will be automatically numbered."
                    rows="6"
                    required
                  />
                  <small className="text-muted">Enter each step on a new line. They will be automatically numbered.</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cooking Time (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="cookingTime"
                    value={recipe.cookingTime}
                    onChange={handleChange}
                    min="1"
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
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Share Recipe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRecipe;