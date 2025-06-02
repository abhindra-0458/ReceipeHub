const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    validate: {
      validator: v => v.trim().length > 0,
      message: 'Unit cannot be empty'
    }
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

const PendingEditSchema = new Schema({
  proposedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changes: {
    title: String,
    description: String,
    servings: Number,
    prepTime: Number,
    cookTime: Number,
    ingredients: [IngredientSchema],
    steps: [StepSchema]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
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
    required: true,
    default: 0
  },
  cookTime: {
    type: Number,
    required: true,
    default: 0
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
  pendingEdits: [PendingEditSchema],
  collaborators: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: String,
      enum: ['edit', 'suggest'],
      default: 'suggest'
    }
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

// Middleware to update updatedAt on save
RecipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
