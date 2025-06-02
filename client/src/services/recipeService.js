import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes';

// Create axios instance with auth header
const authAxios = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // ✅ Fix is here
    }
  });
};

// Get all public recipes
const getPublicRecipes = async () => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data;
};

// Get user's recipes
const getUserRecipes = async () => {
  const response = await authAxios().get('/');
  return response.data;
};

// Get recipe by ID
const getRecipeById = async (id) => {
  const response = await authAxios().get(`/${id}`);
  return response.data;
};

// Create new recipe
const createRecipe = async (recipeData) => {
  const response = await authAxios().post('/', recipeData);
  return response.data;
};

// Update recipe
const updateRecipe = async (id, recipeData) => {
  const response = await authAxios().patch(`/${id}`, recipeData);
  return response.data;
};

// Delete recipe
const deleteRecipe = async (id) => {
  const response = await authAxios().delete(`/${id}`);
  return response.data;
};

// Add these new methods to recipeService
const suggestEdit = async (recipeId, changes) => {
  const response = await api.patch(`/api/recipes/${recipeId}`, changes);
  return response.data;
};

const getPendingEdits = async (recipeId) => {
  const response = await api.get(`/api/recipes/${recipeId}/pending-edits`);
  return response.data;
};

const reviewEdit = async (recipeId, editId, status) => {
  const response = await api.post(`/api/recipes/${recipeId}/pending-edits/${editId}/review`, { status });
  return response.data;
};

const recipeService = {
  getPublicRecipes,
  getUserRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};

export default recipeService;