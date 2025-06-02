// Client-side utility (client/src/utils/recipeUtils.js)
export const scaleIngredients = (ingredients, originalServings, newServings) => {
    if (!ingredients || !originalServings || !newServings) return ingredients;
    
    const scaleFactor = newServings / originalServings;
    
    return ingredients.map(ingredient => ({
      ...ingredient,
      quantity: parseFloat((ingredient.quantity * scaleFactor).toFixed(2))
    }));
  };