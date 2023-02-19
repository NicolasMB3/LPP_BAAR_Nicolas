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
         for (let j = 0; j < this.recipes[i].ingredients.length; j++) {
            this.ingredients.push(this.recipes[i].ingredients[j].ingredient.toLowerCase());
         }

         for (let j = 0; j < this.recipes[i].ustensils.length; j++) {
            this.ustensils.push(this.recipes[i].ustensils[j].toLowerCase());
         }

         this.appliances.push(this.recipes[i].appliance.toLowerCase());

         // Add ingredients, quantity and unit in arrays to create card item
         let ingredients = [];
         let quantity = [];
         let unit = [];

         for (let j = 0; j < this.recipes[i].ingredients.length; j++) {
            ingredients.push(this.recipes[i].ingredients[j].ingredient);
            quantity.push(this.recipes[i].ingredients[j].quantity || 'x');
            unit.push(this.recipes[i].ingredients[j].unit || '');
         }

         // create card item for each recipe
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
         div.classList.add('col-4');
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