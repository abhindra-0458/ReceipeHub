import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RecipeSteps from '../components/RecipeSteps';
import recipeService from '../services/recipeService';
import { scaleIngredients } from '../utils/recipeUtils';
import { useAuth } from '../hooks/useAuth';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(0);
  const [scaledIngredients, setScaledIngredients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
        setServings(data.servings);
        setScaledIngredients(data.ingredients);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecipe();
    } else {
      // For now, use dummy data
      const dummyRecipe = {
        _id: id,
        title: 'Chocolate Cake',
        description: 'Delicious chocolate cake recipe',
        servings: 8,
        prepTime: 20,
        cookTime: 35,
        ingredients: [
          { name: 'all-purpose flour', quantity: 2, unit: 'cups' },
          { name: 'granulated sugar', quantity: 1.5, unit: 'cups' },
          { name: 'cocoa powder', quantity: 0.75, unit: 'cup' },
          { name: 'baking powder', quantity: 1.5, unit: 'teaspoons' },
          { name: 'baking soda', quantity: 1.5, unit: 'teaspoons' },
          { name: 'salt', quantity: 1, unit: 'teaspoon' },
          { name: 'eggs', quantity: 2, unit: '' },
          { name: 'milk', quantity: 1, unit: 'cup' },
          { name: 'vegetable oil', quantity: 0.5, unit: 'cup' },
          { name: 'vanilla extract', quantity: 2, unit: 'teaspoons' },
          { name: 'boiling water', quantity: 1, unit: 'cup' }
        ],
        steps: [
          { order: 1, description: 'Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.', timerMinutes: 0 },
          { order: 2, description: 'In a large bowl, combine flour, sugar, cocoa, baking powder, baking soda, and salt.', timerMinutes: 0 },
          { order: 3, description: 'Add eggs, milk, oil, and vanilla; beat for 2 minutes on medium speed.', timerMinutes: 2 },
          { order: 4, description: 'Stir in boiling water (batter will be thin). Pour into prepared pans.', timerMinutes: 0 },
          { order: 5, description: 'Bake for 30-35 minutes or until a toothpick inserted in the center comes out clean.', timerMinutes: 35 },
          { order: 6, description: 'Cool in pans for 10 minutes before removing to cool completely on wire racks.', timerMinutes: 10 }
        ],
        owner: { _id: 'user1', name: 'John Doe' },
        collaborators: [
          { _id: 'user2', name: 'Jane Smith' },
          { _id: 'user3', name: 'Bob Johnson' }
        ],
        isPublic: true,
        createdAt: '2023-06-15T10:30:00Z',
        updatedAt: '2023-06-16T14:45:00Z'
      };
      
      setTimeout(() => {
        setRecipe(dummyRecipe);
        setServings(dummyRecipe.servings);
        setScaledIngredients(dummyRecipe.ingredients);
        setLoading(false);
      }, 500);
    }
  }, [id, isAuthenticated]);

  const handleServingsChange = (newServings) => {
    if (newServings < 1) return;
    
    const newIngredients = scaleIngredients(recipe.ingredients, recipe.servings, newServings);
    
    setServings(newServings);
    setScaledIngredients(newIngredients);
  };

  const handleDeleteRecipe = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.deleteRecipe(id);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        setError('Failed to delete recipe');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!recipe) {
    return <div className="not-found">Recipe not found</div>;
  }

  return (
    <div className="recipe-detail-page">
      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <div className="recipe-meta">
          <span>By {recipe.owner.name}</span>
          <span className={`visibility ${recipe.isPublic ? 'public' : 'private'}`}>
            {recipe.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        <p className="recipe-description">{recipe.description}</p>
      </div>
      
      <div className="recipe-info">
        <div className="info-item">
          <span className="info-label">Prep Time:</span>
          <span className="info-value">{recipe.prepTime} mins</span>
        </div>
        <div className="info-item">
          <span className="info-label">Cook Time:</span>
          <span className="info-value">{recipe.cookTime} mins</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Time:</span>
          <span className="info-value">{recipe.prepTime + recipe.cookTime} mins</span>
        </div>
        <div className="info-item servings">
          <span className="info-label">Servings:</span>
          <div className="servings-control">
            <button 
              onClick={() => handleServingsChange(servings - 1)}
              disabled={servings <= 1}
            >
              -
            </button>
            <span>{servings}</span>
            <button onClick={() => handleServingsChange(servings + 1)}>
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="recipe-content">
        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {scaledIngredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        
        <RecipeSteps steps={recipe.steps} />
      </div>
      
      <div className="recipe-collaboration">
        <h3>Collaborators</h3>
        {recipe.collaborators.length === 0 ? (
          <p>No collaborators yet</p>
        ) : (
          <ul className="collaborators-list">
            {recipe.collaborators.map(collab => (
              <li key={collab._id}>{collab.name}</li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="recipe-actions">
        <Link to={`/recipes/${recipe._id}/edit`} className="edit-btn">Edit Recipe</Link>
        <button onClick={handleDeleteRecipe} className="delete-btn">Delete Recipe</button>
      </div>
    </div>
  );
};

export default RecipeDetail;