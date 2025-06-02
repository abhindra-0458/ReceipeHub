const express = require('express');
const { createRecipe, getRecipes, getRecipe, updateRecipe, deleteRecipe } = require('../controllers/recipe');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createRecipe);
router.get('/', auth, getRecipes);
router.get('/:id', auth, getRecipe);
router.patch('/:id', auth, updateRecipe);
router.delete('/:id', auth, deleteRecipe);

module.exports = router;