import CreateCard from './Cards.js';

class RecipeList {
   constructor(recipes) {
      this.recipes = recipes;
      this.ingredients = [];
      this.appliances = [];
      this.ustensils = [];

      this.selectedElements = {
         ingredients: [],
         appliances: [],
         ustensils: []
      };
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
      let listContainer = document.querySelector(`#result-menu-${name} .row`);
      listContainer.innerHTML = '';
      this.removeDuplicate(elements).forEach(element => {
         let div = document.createElement('div');
         div.classList.add('col-sm-6', 'col-md-4');
         div.innerHTML = element;
         div.addEventListener('click', () => {
            this.createBadge(element, name);
         });
         listContainer.appendChild(div);
      });
   }

   displayAllLists() {
      this.boucleArray();
      this.displayList(this.ingredients, 'ingredients');
      this.displayList(this.appliances, 'appliances');
      this.displayList(this.ustensils, 'ustensils');

      this.searchIngredients();
      this.searchAppliances();
      this.searchUstensils();
   }

   searchRecipe() {
      let searchInput = document.querySelector('#floatingInput');
      searchInput.addEventListener('keyup', (event) => {
         let searchValue = event.target.value.toLowerCase();
         let searchResults = this.recipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(searchValue) ||
               recipe.description.toLowerCase().includes(searchValue) ||
               recipe.ingredients.some(ingredient => {
                  return ingredient.ingredient.toLowerCase().includes(searchValue);
               }) ||
               recipe.appliance.toLowerCase().includes(searchValue) ||
               recipe.ustensils.some(ustensil => {
                  return ustensil.toLowerCase().includes(searchValue);
               });
         });
         let recipeCards = document.querySelectorAll('.card-contenu');
         recipeCards.forEach(card => {
            let cardTitle = card.querySelector('.card-title');
            if (!searchResults.some(recipe => cardTitle.textContent.toLowerCase() === recipe.name.toLowerCase())) {
               card.style.display = 'none';
            } else {
               card.style.display = 'block';
            }
         });
      });
   }

   createBadge(element, type) {
      let badgeContainer = document.querySelector('.container-badge');
      let badge = document.createElement('button');
      badge.classList.add('btn', 'mt-2', 'me-2', 'p-2', 'd-flex', 'align-items-center', 'align-middle');
      switch (type) {
         case 'appareils':
            badge.classList.add('btn-success');
            break;
         case 'appliances':
            badge.classList.add('btn-success');
            break;
         case 'ustensils':
            badge.classList.add('btn-danger');
            break;
         default:
            badge.classList.add('btn-primary');
      }
      badge.innerHTML = `${element} <span class="ms-2 d-flex align-items-center"><img src="/img/cross-badge.svg" alt="Fermer le badge"></span>`;
      badgeContainer.appendChild(badge);
      let closeBtn = badge.querySelector('img');
      closeBtn.addEventListener('click', () => {
         badge.remove();
         this.selectedElements[type] = [];
         this.filterRecipes();
      });

      // add event listener to filter recipes on badge click
      badge.addEventListener('click', () => {
         // update selected elements with all currently selected badges of the same type
         let selectedBadges = document.querySelectorAll(`.container-badge .btn-${type}`);
         this.selectedElements[type] = Array.from(selectedBadges).map(badge => badge.textContent.trim().toLowerCase());
         // filter recipes
         this.filterRecipes();
      });

      // add class to badge to identify its type
      badge.classList.add(`btn-${type}`);

      this.selectedElements[type].push(element.toLowerCase());
      this.filterRecipes();
   }

   filterRecipes() {
      let recipeCards = document.querySelectorAll('.card-contenu');
      recipeCards.forEach(card => {
         let recipe = this.recipes.find(recipe => recipe.name.toLowerCase() === card.querySelector('.card-title').textContent.toLowerCase());
         if (!recipe) {
            return;
         }
         let hideCard = false;
         if (this.selectedElements.ingredients.length > 0) {
            hideCard = !recipe.ingredients.some(ingredient => this.selectedElements.ingredients.includes(ingredient.ingredient.toLowerCase()));
         }
         if (this.selectedElements.appliances.length > 0 && !hideCard) {
            hideCard = recipe.appliance.toLowerCase() !== this.selectedElements.appliances[0];
         }
         if (this.selectedElements.ustensils.length > 0 && !hideCard) {
            hideCard = !recipe.ustensils.some(ustensil => this.selectedElements.ustensils.includes(ustensil.toLowerCase()));
         }
         card.style.display = hideCard ? 'none' : 'block';
      });
   }

   searchIngredients() {
      let searchInput = document.querySelector('#input-ingredients');
      searchInput.addEventListener('keyup', (event) => {
         let searchValue = event.target.value.toLowerCase();
         let elements = this.ingredients.filter(element => element.includes(searchValue));
         this.displayList(elements, 'ingredients');
      });
   }

   searchAppliances() {
      let searchInput = document.querySelector('#input-appareils');
      searchInput.addEventListener('keyup', (event) => {
         let searchValue = event.target.value.toLowerCase();
         let elements = this.appliances.filter(element => element.includes(searchValue));
         this.displayList(elements, 'appliances');
      });
   }

   searchUstensils() {
      let searchInput = document.querySelector('#input-ustensile');
      searchInput.addEventListener('keyup', (event) => {
         let searchValue = event.target.value.toLowerCase();
         let elements = this.ustensils.filter(element => element.includes(searchValue));
         this.displayList(elements, 'ustensils');
      });
   }
}
export default RecipeList; 