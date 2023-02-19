import Display from './models/Inputs.js';
import CreateCard from './models/Cards.js';

function init() {
   Display.init();
}

init();

// Rework the code below to use the Display class
// Display ingredients list in the result menu
let ingredients = [],
   appliances = [],
   ustensils = [];

function boucleArray(elements) {
   for (let i = 0; i < recipes.length; i++) {
      if (elements === ingredients) {
         // Add ingredients, quantity and unit in arrays to create card item
         let ingredients = [],
            quantity = [],
            unit = [];

         for (let j = 0; j < recipes[i].ingredients.length; j++) {
            ingredients.push(recipes[i].ingredients[j].ingredient);
            quantity.push(recipes[i].ingredients[j].quantity || 'x');
            unit.push(recipes[i].ingredients[j].unit || '');
         }
         // create card item for each recipe
         let card = new CreateCard(recipes[i].name, recipes[i].time || '< 1', recipes[i].description, ingredients, quantity, unit);
         card.createCardItem();

         for (let j = 0; j < recipes[i].ingredients.length; j++) {
            elements.push(recipes[i].ingredients[j].ingredient.toLowerCase());
         }
      } else if (elements === ustensils) {
         for (let j = 0; j < recipes[i].ustensils.length; j++) {
            elements.push(recipes[i].ustensils[j].toLowerCase());
         }
      } else if (elements === appliances) {
         appliances.push(recipes[i].appliance.toLowerCase());
      }
   }
}

boucleArray(ingredients);
boucleArray(appliances);
boucleArray(ustensils);

function removeDuplicate(elements) {
   return elements.filter((element, index) => {
      return elements.indexOf(element) === index;
   });
}

function displayList(elements, name) {
   removeDuplicate(elements).forEach(element => {
      let div = document.createElement('div');
      div.classList.add('col-4');
      div.innerHTML = element;
      document.querySelector(`#result-menu-${name} .row`).appendChild(div);
   });
}

displayList(ingredients, 'ingredients');
displayList(appliances, 'appareils');
displayList(ustensils, 'ustensile');