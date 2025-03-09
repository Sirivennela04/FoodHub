import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching recipe details for ID:", id);

        const response = await fetch(`https://food-hub-server-beta.vercel.app/recipes/${id}`);

        if (!response.ok) {
          throw new Error("Recipe not found");
        }

        const data = await response.json();
        setRecipe(data);
        console.log("Recipe details:", data);

        if (token) {
          console.log("Checking if recipe is saved...");
          const savedResponse = await fetch("https://food-hub-server-beta.vercel.app/recipes/saved", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (savedResponse.ok) {
            const savedRecipes = await savedResponse.json();
            console.log("Saved recipes:", savedRecipes);
            setIsSaved(savedRecipes.some((savedRecipe) => savedRecipe._id === id));
          } else {
            console.warn("Failed to fetch saved recipes.");
          }
        }
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, token]);

  const handleSaveRecipe = async () => {
    if (!token) {
      setSaveError("Please log in to save recipes.");
      return;
    }

    try {
      console.log(isSaved ? "Unsaving recipe..." : "Saving recipe...");
      const response = await fetch(`https://food-hub-server-beta.vercel.app/recipes/save/${id}`, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isSaved ? "Failed to unsave recipe" : "Failed to save recipe"));
      }

      setIsSaved(!isSaved);
      setSaveError(null);
      console.log(isSaved ? "Recipe unsaved successfully" : "Recipe saved successfully");
    } catch (err) {
      console.error("Error saving recipe:", err);
      setSaveError(err.message);
    }
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    return instructions
      .split(/[.\n]|\d+\.|^\s*•\s*/m)
      .map((step) => step.trim())
      .filter((step) => step.length > 0);
  };

  if (loading) {
    return <div>Loading recipe details...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
        <br />
        <Link to="https://food-hub-silk.vercel.app/recipes" className="btn btn-primary mt-3">
          Back to Recipes
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="alert alert-warning">
        Recipe not found
        <br />
        <Link to="https://food-hub-silk.vercel.app/recipes" className="btn btn-primary mt-3">
          Back to Recipes
        </Link>
      </div>
    );
  }

  const instructionSteps = formatInstructions(recipe.instructions);

  return (
    <div className="container mt-4">
      {/* Recipe Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-start">
          <div>
            <h2 className="mb-3">{recipe.name}</h2>
            <p className="text-muted">
              {recipe.cuisine} • {recipe.cookingTime} minutes
              <br />
              <small>Shared by: {recipe.userOwner}</small>
            </p>
          </div>
          {token && (
            <button
              onClick={handleSaveRecipe}
              className={`btn ${isSaved ? "btn-danger" : "btn-outline-primary"}`}
            >
              {isSaved ? "Unsave Recipe" : "Save Recipe"}
            </button>
          )}
        </div>
        {saveError && (
          <div className="col-12">
            <div className="alert alert-danger">{saveError}</div>
          </div>
        )}
      </div>

      {/* Image and Ingredients */}
      <div className="row mb-5">
        <div className="col-md-6">
          <img
            src={recipe.imageUrl}
            className="img-fluid rounded shadow"
            alt={recipe.name}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title">Ingredients</h4>
              <ul className="list-group list-group-flush">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-group-item">
                    <i className="bi bi-check2 me-2"></i>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-10">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Cooking Instructions</h4>
              <ol className="list-group list-group-numbered">
                {instructionSteps.map((step, index) => (
                  <li key={index} className="list-group-item">
                    <div className="ms-2 me-auto">
                      <div className="fw-normal">{step}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="row">
        <div className="col-12 text-center">
          <Link to="https://food-hub-silk.vercel.app/recipes" className="btn btn-secondary">
            Back to Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
