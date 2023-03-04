import CreateCard from './Cards.js';
import Display from './Inputs.js';

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
      searchInput.addEventListener('keyup', () => {
         this.filterRecipes();
         this.updateLists();
         this.checkIfNoNul();
      });
      searchInput.addEventListener('keyup', (event) => {
         let searchValue = event.target.value.toLowerCase();
         let searchResults = this.recipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(searchValue) ||
               recipe.description.toLowerCase().includes(searchValue) ||
               recipe.appliance.toLowerCase().includes(searchValue) ||
               recipe.ingredients.some(ingredient => {
                  return ingredient.ingredient.toLowerCase().includes(searchValue);
               }) ||
               recipe.ustensils.some(ustensil => {
                  return ustensil.toLowerCase().includes(searchValue);
               });
         });

         // get all selected badges
         let selectedBadges = document.querySelectorAll('.container-badge button');

         // filter recipes based on searchValue and selected badges
         let filteredRecipes = searchResults.filter(recipe => {
            let matchesSearchValue = true;
            let matchesSelectedBadges = true;

            if (searchValue) {
               matchesSearchValue = recipe.name.toLowerCase().includes(searchValue) ||
                  recipe.description.toLowerCase().includes(searchValue) ||
                  recipe.appliance.toLowerCase().includes(searchValue) ||
                  recipe.ingredients.some(ingredient => {
                     return ingredient.ingredient.toLowerCase().includes(searchValue);
                  }) ||
                  recipe.ustensils.some(ustensil => {
                     return ustensil.toLowerCase().includes(searchValue);
                  });
            }

            if (selectedBadges.length > 0) {
               let selectedIngredients = Array.from(selectedBadges).filter(badge => badge.classList.contains('btn-primary')).map(badge => badge.textContent.trim().toLowerCase());
               let selectedAppliances = Array.from(selectedBadges).filter(badge => badge.classList.contains('btn-success')).map(badge => badge.textContent.trim().toLowerCase());
               let selectedUstensils = Array.from(selectedBadges).filter(badge => badge.classList.contains('btn-danger')).map(badge => badge.textContent.trim().toLowerCase());

               if (selectedIngredients.length > 0) {
                  matchesSelectedBadges = recipe.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
               }
               if (selectedAppliances.length > 0) {
                  matchesSelectedBadges = recipe.appliance.toLowerCase() === selectedAppliances[0];
               }
               if (selectedUstensils.length > 0) {
                  matchesSelectedBadges = recipe.ustensils.some(ustensil => selectedUstensils.includes(ustensil.toLowerCase()));
               }
            }

            return matchesSearchValue && matchesSelectedBadges;
         });

         // hide/show recipe cards based on filtered recipes
         let recipeCards = document.querySelectorAll('.card-contenu');
         recipeCards.forEach(card => {
            let recipe = this.recipes.find(recipe => recipe.name.toLowerCase() === card.querySelector('.card-title').textContent.toLowerCase());
            if (!recipe) {
               return;
            }
            let hideCard = !filteredRecipes.includes(recipe);
            card.style.display = hideCard ? 'none' : 'block';
         });
      });

      this.filterRecipes();
   }

   createBadge(element, type) {
      let badgeContainer = document.querySelector('.container-badge');
      let badgeExists = Array.from(badgeContainer.children).some(badge => {
         return badge.textContent.trim().toLowerCase() === element.toLowerCase() && badge.classList.contains(`btn-${type}`);
      });
      if (!badgeExists) {
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
         badge.innerHTML = `${element.charAt(0).toUpperCase() + element.slice(1)} <span class="ms-2 d-flex align-items-center"><img src="img/cross-badge.svg" alt="Fermer le badge"></span>`;
         badgeContainer.appendChild(badge);
         let closeBtn = badge.querySelector('img');
         closeBtn.addEventListener('click', () => {
            badge.remove();
            let index = this.selectedElements[type].indexOf(element.toLowerCase());
            if (index !== -1) {
               this.selectedElements[type].splice(index, 1);
               this.filterRecipes();
            }
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

         // update the list of ingredients, appliances, or utensils to include the new badge element
         switch (type) {
            case 'ingredients':
               this.selectedElements.ingredients.push(element.toLowerCase());
               break;
            case 'appliances':
               this.selectedElements.appliances = [element.toLowerCase()];
               break;
            case 'ustensils':
               this.selectedElements.ustensils.push(element.toLowerCase());
               break;
         }

         // filter the recipes based on the new selection
         this.filterRecipes();
      }
   }

   filterRecipes() {
      let recipeCards = document.querySelectorAll('.card-contenu');
      let selectedIngredients = this.selectedElements.ingredients;
      let selectedAppliances = this.selectedElements.appliances;
      let selectedUstensils = this.selectedElements.ustensils;
      let searchValue = document.querySelector('#floatingInput').value.toLowerCase();

      let filteredIngredients = [];
      let filteredAppliances = [];
      let filteredUstensils = [];

      recipeCards.forEach(card => {
         let recipe = this.recipes.find(recipe => recipe.name.toLowerCase() === card.querySelector('.card-title').textContent.toLowerCase());
         if (!recipe) {
            return;
         }
         let hideCard = false;
         if (selectedIngredients.length > 0) {
            // check if all selected ingredient badges are present in the recipe
            hideCard = !selectedIngredients.every(selectedIngredient => {
               return recipe.ingredients.some(ingredient => {
                  return ingredient.ingredient.toLowerCase() === selectedIngredient;
               });
            });
         }
         if (selectedAppliances.length > 0 && !hideCard) {
            hideCard = recipe.appliance.toLowerCase() !== selectedAppliances[0];
         }
         if (selectedUstensils.length > 0 && !hideCard) {
            hideCard = !recipe.ustensils.some(ustensil => selectedUstensils.includes(ustensil.toLowerCase()));
         }
         if (searchValue && !hideCard) {
            hideCard = !(
               recipe.name.toLowerCase().includes(searchValue) ||
               recipe.description.toLowerCase().includes(searchValue) ||
               recipe.appliance.toLowerCase().includes(searchValue) ||
               recipe.ingredients.some(ingredient => {
                  return ingredient.ingredient.toLowerCase().includes(searchValue);
               }) ||
               recipe.ustensils.some(ustensil => {
                  return ustensil.toLowerCase().includes(searchValue);
               })
            );
         }

         if (!hideCard) {
            recipe.ingredients.forEach(ingredient => {
               let ingredientName = ingredient.ingredient.toLowerCase();
               if (!filteredIngredients.includes(ingredientName)) {
                  filteredIngredients.push(ingredientName);
               }
            });
            if (selectedAppliances.length === 0 || recipe.appliance.toLowerCase() === selectedAppliances[0]) {
               filteredAppliances.push(recipe.appliance.toLowerCase());
            }
            recipe.ustensils.forEach(ustensil => {
               let ustensilName = ustensil.toLowerCase();
               filteredUstensils.push(ustensilName);
            });
         }
         card.style.display = hideCard ? 'none' : 'block';
      });

      filteredIngredients = this.removeDuplicate(filteredIngredients);
      filteredAppliances = this.removeDuplicate(filteredAppliances);
      filteredUstensils = this.removeDuplicate(filteredUstensils);

      this.displayList(filteredIngredients, 'ingredients');
      this.displayList(filteredAppliances, 'appliances');
      this.displayList(filteredUstensils, 'ustensils');
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

   updateLists() {
      // get all currently displayed recipes
      let recipeCards = document.querySelectorAll('.card-contenu');
      let displayedRecipes = Array.from(recipeCards).filter(card => {
         return card.style.display !== 'none';
      });

      // get all ingredients, appliances, and ustensils from displayed recipes
      let filteredIngredients = [];
      let filteredAppliances = [];
      let filteredUstensils = [];

      displayedRecipes.forEach(recipe => {
         let recipeData = this.recipes.find(data => {
            return data.name.toLowerCase() === recipe.querySelector('.card-title').textContent.toLowerCase();
         });
         recipeData.ingredients.forEach(ingredient => {
            let ingredientName = ingredient.ingredient.toLowerCase();
            if (!filteredIngredients.includes(ingredientName)) {
               filteredIngredients.push(ingredientName);
            }
         });
         let applianceName = recipeData.appliance.toLowerCase();
         if (!filteredAppliances.includes(applianceName)) {
            filteredAppliances.push(applianceName);
         }
         recipeData.ustensils.forEach(ustensil => {
            let ustensilName = ustensil.toLowerCase();
            if (!filteredUstensils.includes(ustensilName)) {
               filteredUstensils.push(ustensilName);
            }
         });
      });

      this.displayList(filteredIngredients, 'ingredients');
      this.displayList(filteredAppliances, 'appliances');
      this.displayList(filteredUstensils, 'ustensils');
   }

   checkIfNoNul() {
      let recipeCards = document.querySelectorAll('.card-contenu');
      let numHiddenCards = 0;

      recipeCards.forEach(card => {
         if (card.style.display === 'none') {
            numHiddenCards++;
         }
      });

      if (numHiddenCards === recipeCards.length) {
         document.getElementById('no-results').classList.remove('d-none');
         document.getElementById('input-ustensile').setAttribute('disabled', '')
         document.getElementById('input-appareils').setAttribute('disabled', '')
         document.getElementById('input-ingredients').setAttribute('disabled', '')
      } else {
         document.getElementById('no-results').classList.add('d-none');
         document.getElementById('input-ustensile').disabled = false;
         document.getElementById('input-appareils').disabled = false;
         document.getElementById('input-ingredients').disabled = false;
      }
   }
}
export default RecipeList; 