import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section text-center py-5">
        <h1 className="display-3 fw-bold">Welcome to Food Hub</h1>
        <p className="lead fs-4 mb-4">Your Ultimate Destination for Culinary Inspiration</p>
        <div className="cta-buttons">
          <Link to="/recipes" className="btn btn-primary btn-lg me-3">
            <i className="fas fa-search me-2"></i>
            Explore Recipes
          </Link>
          <Link to="/add-recipe" className="btn btn-success btn-lg me-3">
          <i className="fas fa-share-alt me-2"></i>
          Share Your Recipe
          </Link>

        </div>

        <div className="features-section row mt-5 pt-5">
    <div className="col-md-4">
        <div className="feature-card text-center p-4">
            <i className="fas fa-book-open fa-3x text-primary mb-3"></i>
            <h3>Discover Recipes</h3>
            <p>Explore thousands of recipes from around the world</p>
        </div>
    </div>
    <div className="col-md-4">
        <div className="feature-card text-center p-4">
            <i className="fas fa-share-alt fa-3x text-primary mb-3"></i>
            <h3>Share & Connect</h3>
            <p>Join our community of food lovers and share your creations</p>
        </div>
    </div>
    <div className="col-md-4">
        <div className="feature-card text-center p-4">
            <i className="fas fa-star fa-3x text-primary mb-3"></i>
            <h3>Save Favorites</h3>
            <p>Create your personal collection of favorite recipes</p>
        </div>
    </div>
</div>
      </div>
    </div>
  );
}

export default Home;