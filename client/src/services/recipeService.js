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
      'x-auth-token': token
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
  const response = await authAxios().put(`/${id}`, recipeData);
  return response.data;
};

// Delete recipe
const deleteRecipe = async (id) => {
  const response = await authAxios().delete(`/${id}`);
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