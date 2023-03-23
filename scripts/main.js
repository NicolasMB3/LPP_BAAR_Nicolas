import Display from './models/Inputs.js';
import RecipeList from './models/Recipes.js';

function init () {
  // Input Display
  Display.init();
  // Get and display recipes/ingredients/appliances/utensils in list and cards
  // eslint-disable-next-line no-undef
  const recipe = new RecipeList(recipes);
  recipe.displayAllLists();
  recipe.searchRecipe();
}

init();
