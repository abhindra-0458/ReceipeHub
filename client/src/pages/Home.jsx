import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to RecipeHub</h1>
        <p>Your collaborative recipe platform - like GitHub for recipes!</p>
        
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Co-Author Recipes</h3>
            <p>Collaborate with friends and family on recipes in real-time</p>
          </div>
          <div className="feature-card">
            <h3>Scale Ingredients</h3>
            <p>Automatically adjust ingredient quantities for different serving sizes</p>
          </div>
          <div className="feature-card">
            <h3>Step-by-Step Instructions</h3>
            <p>Follow clear instructions with built-in timers</p>
          </div>
          <div className="feature-card">
            <h3>Version Control</h3>
            <p>Track changes and improvements to your recipes over time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;