import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
// Add to your imports
import { useAuth } from '../hooks/useAuth';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servings: 4,
    prepTime: 0,
    cookTime: 0,
    isPublic: true,
    tags: [],
    ingredients: [{ name: '', quantity: 0, unit: '' }],
    steps: [{ order: 1, description: '', timerMinutes: 0 }]
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      const fetchRecipe = async () => {
        try {
          const data = await recipeService.getRecipeById(id);
          setFormData(data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to load recipe');
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: field === 'quantity' ? parseFloat(value) || 0 : value
    };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: 0, unit: '' }]
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: field === 'timerMinutes' ? parseFloat(value) || 0 : value
    };
    setFormData({ ...formData, steps: updatedSteps });
  };

  const addStep = () => {
    const newOrder = formData.steps.length + 1;
    setFormData({
      ...formData,
      steps: [...formData.steps, { order: newOrder, description: '', timerMinutes: 0 }]
    });
  };

  const removeStep = (index) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    // Reorder steps
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      order: i + 1
    }));
    setFormData({ ...formData, steps: reorderedSteps });
  };

  // Inside RecipeForm component, update handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (id) {
        const result = await recipeService.updateRecipe(id, formData);
        if (result.status === 'pending') {
          // Show message for pending approval
          setError(result.message); // This will show "Edit suggestion submitted for owner approval"
        } else {
          navigate('/dashboard');
        }
      } else {
        await recipeService.createRecipe(formData);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Save recipe error:', err.response?.data || err.message || err);
      setError(
        'Failed to save recipe: ' + (err.response?.data?.message || err.message || 'Unknown error')
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="recipe-form-page">
      <h1>{id ? 'Edit Recipe' : 'Create New Recipe'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">Recipe Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="prepTime">Prep Time (mins)</label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cookTime">Cook Time (mins)</label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <label htmlFor="isPublic">Make this recipe public</label>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Ingredients</h2>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <div className="form-group quantity">
                <label>Quantity</label>
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group unit">
                <label>Unit</label>
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                  placeholder="e.g., cups, tbsp"
                />
              </div>
              
              <div className="form-group name">
                <label>Ingredient</label>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  placeholder="e.g., flour, sugar"
                  required
                />
              </div>
              
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeIngredient(index)}
                disabled={formData.ingredients.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          
          <button type="button" className="add-btn" onClick={addIngredient}>
            Add Ingredient
          </button>
        </div>
        
        <div className="form-section">
          <h2>Instructions</h2>
          {formData.steps.map((step, index) => (
            <div key={index} className="step-row">
              <div className="step-number">{step.order}</div>
              
              <div className="form-group description">
                <label>Step Description</label>
                <textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  rows="2"
                  required
                />
              </div>
              
              <div className="form-group timer">
                <label>Timer (mins)</label>
                <input
                  type="number"
                  value={step.timerMinutes}
                  onChange={(e) => handleStepChange(index, 'timerMinutes', e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>
              
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeStep(index)}
                disabled={formData.steps.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          
          <button type="button" className="add-btn" onClick={addStep}>
            Add Step
          </button>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            {id ? 'Update Recipe' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;