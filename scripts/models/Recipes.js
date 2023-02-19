import CreateCard from './Cards.js';

class RecipeList {
   constructor(recipes) {
      this.recipes = recipes;
      this.ingredients = [];
      this.appliances = [];
      this.ustensils = [];
   }

   boucleArray() {
      for (let i = 0; i < this.recipes.length; i++) {
         // Get element for recipes
         const ingredientList = this.recipes[i].ingredients,
            ustensilsList = this.recipes[i].ustensils;

         // Create array for ingredients, quantity and unit
         let ingredients = [],
            quantity = [],
            unit = [];

         for (let b = 0; b < ustensilsList.length; b++) {
            this.ustensils.push(ustensilsList[b].toLowerCase());
         }

         for (let c = 0; c < ingredientList.length; c++) {
            ingredients.push(ingredientList[c].ingredient || '');
            quantity.push(ingredientList[c].quantity || 'x');
            unit.push(ingredientList[c].unit || '');
            this.ingredients.push(ingredientList[c].ingredient.toLowerCase());
         }

         this.appliances.push(this.recipes[i].appliance.toLowerCase());

         // Create card item for each recipe
         let card = new CreateCard(this.recipes[i].name, this.recipes[i].time || '< 1', this.recipes[i].description, ingredients, quantity, unit);
         card.createCardItem();
      }
   }

   removeDuplicate(elements) {
      return elements.filter((element, index) => {
         return elements.indexOf(element) === index;
      });
   }

   displayList(elements, name) {
      this.removeDuplicate(elements).forEach(element => {
         let div = document.createElement('div');
         div.classList.add('col-sm-6', 'col-md-4');
         div.innerHTML = element;
         document.querySelector(`#result-menu-${name} .row`).appendChild(div);
      });
   }

   displayAllLists() {
      this.boucleArray();
      this.displayList(this.ingredients, 'ingredients');
      this.displayList(this.appliances, 'appareils');
      this.displayList(this.ustensils, 'ustensile');
   }
}
export default RecipeList; 