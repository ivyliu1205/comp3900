// This file is expected to be modified by Django template
const timeout = 50000;

const baseUrl = 'http://localhost:8000/'


const getLabelsSubPath = 'labels/'
const getMatchRecipeSubPath = 'recipes/'
const getRecipeDetailsSubPath = 'recipes/'

const loginSubPath = 'users/login/'
const registerinSubPath = 'users/register/'
// const logoutSubPath = 'users/logout/'
const getUserProfileSubPath = 'users/profile/'
const changePasswordSubPath = 'users/profile/changePassword/'
const refreshAuthSubPath = 'users/refresh/'

const getCreatorRecipesSubPath = 'creators/recipes/'
const getCreatorRecipeDetailsSubPath = 'creators/recipes/details/'
const createRecipeSubPath = 'creators/recipes/create/'
const editRecipeSubPath = 'creators/recipes/edit/'
const deleteRecipeSubPath = 'creators/recipes/delete/'
const updateImagesSubPath = 'creators/recipes/images/update';

const tokenKey = "token";

const stopLogging = true;

export {
  timeout,
  baseUrl,

  getLabelsSubPath,
  getMatchRecipeSubPath,
  getRecipeDetailsSubPath,

  loginSubPath,
  registerinSubPath,
  // logoutSubPath,
  getUserProfileSubPath,
  changePasswordSubPath,
  refreshAuthSubPath,

  getCreatorRecipesSubPath,
  getCreatorRecipeDetailsSubPath,
  createRecipeSubPath,
  editRecipeSubPath,
  deleteRecipeSubPath,
  updateImagesSubPath,

  tokenKey,

  stopLogging,
}
