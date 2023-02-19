import Display from './models/Inputs.js';
import RecipeList from './models/Recipes.js';

function init() {
   // Input Display
   Display.init();
   // Get and display recipes/ingredients/appliances/utensils in list and cards
   new RecipeList(recipes).displayAllLists();
}

init();