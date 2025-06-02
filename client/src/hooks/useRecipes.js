import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';

export const useRecipes = () => {
  return useContext(RecipeContext);
};