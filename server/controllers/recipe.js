// Recipe controller (server/controllers/recipe.js)
const Recipe = require('../models/Recipe');
const User = require('../models/User');

const createRecipe = async (req, res) => {
  console.log('Authenticated user ID:', req.userId);
  console.log('Request body:', req.body);

  try {
    const { title, description, servings, tags, ingredients, steps, isPublic } = req.body;
    
    const recipe = await Recipe.create({
      title,
      description,
      servings,
      ingredients,
      steps,
      owner: req.userId,
      isPublic
    });
    
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getRecipes = async (req, res) => {
  try {
    // Get user's own recipes and recipes where user is a collaborator
    const recipes = await Recipe.find({
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId },
        { isPublic: true }
      ]
    }).populate('owner', 'name email');
    
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipe = await Recipe.findById(id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user has access to this recipe
    const isOwner = recipe.owner._id.toString() === req.userId;
    const isCollaborator = recipe.collaborators.some(
      collab => collab.user._id.toString() === req.userId
    );
    
    if (!isOwner && !isCollaborator && !recipe.isPublic) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if user has permission to update
    const isOwner = recipe.owner.toString() === req.userId;
    const isCollaborator = recipe.collaborators.some(
      collab => collab.user.toString() === req.userId && collab.permissions === 'edit'
    );
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    ).populate('owner', 'name email');
    
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Only owner can delete
    if (recipe.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Recipe.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createRecipe, getRecipes, getRecipe, updateRecipe, deleteRecipe };