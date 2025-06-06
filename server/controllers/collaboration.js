// Collaboration controller (server/controllers/collaboration.js)
const Recipe = require('../models/Recipe');
const User = require('../models/User');

const inviteCollaborator = async (req, res) => {
  try {
    const { recipeId, email } = req.body;
    
    // Find recipe
    const recipe = await Recipe.findById(recipeId);
    
    // Check if user is owner
    if (recipe.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already a collaborator
    const isCollaborator = recipe.collaborators.some(
      collab => collab.user.toString() === user._id.toString()
    );
    
    if (isCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    // Add collaborator
    recipe.collaborators.push({
      user: user._id,
      permissions: 'edit'
    });
    
    await recipe.save();
    
    // Send email notification (implementation depends on email service)
    
    res.status(200).json({ message: 'Collaborator invited successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const { recipeId, userId } = req.body;
    
    // Find recipe
    const recipe = await Recipe.findById(recipeId);
    
    // Check if user is owner
    if (recipe.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Remove collaborator
    recipe.collaborators = recipe.collaborators.filter(
      collab => collab.user.toString() !== userId
    );
    
    await recipe.save();
    
    res.status(200).json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateCollaboratorPermissions = async (req, res) => {
  try {
    const { recipeId, userId, permissions } = req.body;
    
    // Find recipe
    const recipe = await Recipe.findById(recipeId);
    
    // Check if user is owner
    if (recipe.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update collaborator permissions
    const collaborator = recipe.collaborators.find(
      collab => collab.user.toString() === userId
    );
    
    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }
    
    collaborator.permissions = permissions;
    
    await recipe.save();
    
    res.status(200).json({ message: 'Permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Add these new controller functions
const suggestEdit = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const changes = req.body;
    
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    if (!recipe.isPublic && !recipe.collaborators.some(c => c.user.toString() === req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    recipe.pendingEdits.push({
      proposedBy: req.userId,
      changes: changes
    });
    
    await recipe.save();
    
    res.status(200).json({ message: 'Edit suggestion submitted for approval' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const reviewEdit = async (req, res) => {
  try {
    const { recipeId, editId } = req.params;
    const { status } = req.body;
    
    const recipe = await Recipe.findById(recipeId);
    if (!recipe || recipe.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const pendingEdit = recipe.pendingEdits.id(editId);
    if (!pendingEdit) {
      return res.status(404).json({ message: 'Edit suggestion not found' });
    }
    
    if (status === 'approved') {
      // Apply the changes
      Object.assign(recipe, pendingEdit.changes);
      pendingEdit.status = 'approved';
    } else {
      pendingEdit.status = 'rejected';
    }
    
    await recipe.save();
    
    res.status(200).json({ message: `Edit suggestion ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { inviteCollaborator, removeCollaborator, updateCollaboratorPermissions, suggestEdit, reviewEdit };