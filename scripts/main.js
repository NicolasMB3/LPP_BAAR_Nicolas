import Display from './models/Inputs.js';

const displayTypes = [
   { containerId: 'container-ingredients', inputId: 'input-ingredients', resultId: 'result-menu-ingredients', arrowId: '#container-ingredients img', placeholderText: 'Ingrédients' },
   { containerId: 'container-appareils', inputId: 'input-appareils', resultId: 'result-menu-appareils', arrowId: '#container-appareils img', placeholderText: 'Appareils' },
   { containerId: 'container-ustensile', inputId: 'input-ustensile', resultId: 'result-menu-ustensile', arrowId: '#container-ustensile img', placeholderText: 'Ustensiles' }
];

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
let ingredients = [];
let appliances = [];
let ustensils = [];

function boucleArray(elements) {
   for (let i = 0; i < recipes.length; i++) {
      if (elements === ingredients) {
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