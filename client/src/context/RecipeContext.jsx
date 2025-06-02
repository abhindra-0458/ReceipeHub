import React, { createContext, useState, useEffect } from 'react';
import recipeService from '../services/recipeService';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublicRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getPublicRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getUserRecipes();
      setUserRecipes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your recipes');
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const newRecipe = await recipeService.createRecipe(recipeData);
      setUserRecipes([...userRecipes, newRecipe]);
      return { success: true, recipe: newRecipe };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create recipe' };
    }
  };

  const updateRecipe = async (id, recipeData) => {
    try {
      const updatedRecipe = await recipeService.updateRecipe(id, recipeData);
      setUserRecipes(userRecipes.map(recipe => 
        recipe._id === id ? updatedRecipe : recipe
      ));
      return { success: true, recipe: updatedRecipe };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update recipe' };
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await recipeService.deleteRecipe(id);
      setUserRecipes(userRecipes.filter(recipe => recipe._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete recipe' };
    }
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      userRecipes,
      loading,
      error,
      fetchPublicRecipes,
      fetchUserRecipes,
      createRecipe,
      updateRecipe,
      deleteRecipe
    }}>
      {children}
    </RecipeContext.Provider>
  );
};