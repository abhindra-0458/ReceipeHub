import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await recipeService.getUserRecipes();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecipes();
    } else {
      // If not authenticated, fetch public recipes
      const fetchPublicRecipes = async () => {
        try {
          const data = await recipeService.getPublicRecipes();
          setRecipes(data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };
      
      fetchPublicRecipes();
    }
  }, [isAuthenticated]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Recipes</h1>
        <Link to="/recipes/new" className="primary-btn">Create New Recipe</Link>
      </div>
      
      {loading ? (
        <div className="loading">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="no-recipes">
          <p>You haven't created any recipes yet.</p>
          <Link to="/recipes/new" className="primary-btn">Create Your First Recipe</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <div className="recipe-meta">
                <span className={`visibility ${recipe.isPublic ? 'public' : 'private'}`}>
                  {recipe.isPublic ? 'Public' : 'Private'}
                </span>
                {recipe.collaborators.length > 0 && (
                  <span className="collaborators">
                    {recipe.collaborators.length} collaborator(s)
                  </span>
                )}
              </div>
              <div className="recipe-actions">
                <Link to={`/recipes/${recipe._id}`} className="view-btn">View</Link>
                <Link to={`/recipes/${recipe._id}/edit`} className="edit-btn">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;