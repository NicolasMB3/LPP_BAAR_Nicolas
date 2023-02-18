import Display from './models/Inputs.js';
import CreateCard from './models/Cards.js';

const displayTypes = [
   { containerId: 'container-ingredients', inputId: 'input-ingredients', resultId: 'result-menu-ingredients', arrowId: '#container-ingredients img', placeholderText: 'Ingrédients' },
   { containerId: 'container-appareils', inputId: 'input-appareils', resultId: 'result-menu-appareils', arrowId: '#container-appareils img', placeholderText: 'Appareils' },
   { containerId: 'container-ustensile', inputId: 'input-ustensile', resultId: 'result-menu-ustensile', arrowId: '#container-ustensile img', placeholderText: 'Ustensiles' }
];

// Init Class Display
for (let i = 0; i < displayTypes.length; i++) {
   let POO = new Display(
      displayTypes[i].containerId,
      displayTypes[i].inputId,
      displayTypes[i].resultId,
      displayTypes[i].arrowId,
      displayTypes[i].placeholderText);
   POO.container.addEventListener('click', () => {
      POO.toggleResultMenu();
   });
};

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
         let card = new CreateCard(recipes[i].name, recipes[i].time, recipes[i].description, ingredients, quantity, unit);
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