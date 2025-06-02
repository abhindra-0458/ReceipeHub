const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const StepSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  timer: {
    type: Number,
    default: 0
  }
});

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  servings: {
    type: Number,
    required: true,
    default: 1
  },
  prepTime: {
    type: Number,
    required: true
  },
  cookTime: {
    type: Number,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  ingredients: [IngredientSchema],
  steps: [StepSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);