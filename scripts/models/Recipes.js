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
      let uniqueElements = this.removeDuplicate(elements);
      for (let i = 0; i < uniqueElements.length; i++) {
         let element = uniqueElements[i];
         let div = document.createElement('div');
         div.classList.add('col-sm-6', 'col-md-4');
         div.innerHTML = element;
         div.addEventListener('click', () => {
            this.createBadge(element, name);
         });
         listContainer.appendChild(div);
      }
   }

   // Display list
   displayAllLists() {
      this.boucleArray();
      
      this.displayList(this.ingredients, 'ingredients');
      this.displayList(this.appliances, 'appliances');
      this.displayList(this.ustensils, 'ustensils');

      this.searchBadges('ingredients');
      this.searchBadges('appliances');
      this.searchBadges('ustensils');
   }

   // Native Array method
   searchRecipe() {
      let searchInput = document.querySelector('#floatingInput');
      searchInput.addEventListener('keyup', (event) => {
         if (event.target.value.length >= 3 || event.target.value.length === 0) {
            let searchValue = event.target.value.toLowerCase();
            let searchResults = [];
            for (let i = 0; i < this.recipes.length; i++) {
               let recipe = this.recipes[i];
               if (recipe.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                  recipe.description.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                  recipe.appliance.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                  recipe.ingredients.some(ingredient => {
                     return ingredient.ingredient.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
                  }) ||
                  recipe.ustensils.some(ustensil => {
                     return ustensil.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
                  })) {
                  searchResults.push(recipe);
               }
            }

            // get all selected badges
            let selectedBadges = document.querySelectorAll('.container-badge button');

            // filter recipes based on searchValue and selected badges
            let filteredRecipes = [];
            for (let i = 0; i < searchResults.length; i++) {
               let recipe = searchResults[i];
               let matchesSearchValue = true;
               let matchesSelectedBadges = true;

               if (selectedBadges.length > 0) {
                  let selectedIngredients = [];
                  let selectedAppliances = [];
                  let selectedUstensils = [];

                  for (const badge of Array.from(selectedBadges)) {
                     const badgeText = badge.textContent.trim().toLowerCase();

                     if (badge.classList.contains('btn-primary')) {
                        selectedIngredients.push(badgeText);
                     } else if (badge.classList.contains('btn-success')) {
                        selectedAppliances.push(badgeText);
                     } else if (badge.classList.contains('btn-danger')) {
                        selectedUstensils.push(badgeText);
                     }
                  }

                  if (selectedIngredients.length > 0) {
                     matchesSelectedBadges = recipe.ingredients.some(ingredient => selectedIngredients.indexOf(ingredient.ingredient.toLowerCase()) !== -1);
                  }
                  if (selectedAppliances.length > 0) {
                     matchesSelectedBadges = recipe.appliance.toLowerCase().indexOf(selectedAppliances[0]) !== -1;
                  }
                  if (selectedUstensils.length > 0) {
                     matchesSelectedBadges = recipe.ustensils.some(ustensil => selectedUstensils.indexOf(ustensil.toLowerCase()) !== -1);
                  }
               }

               if (matchesSearchValue && matchesSelectedBadges) {
                  filteredRecipes.push(recipe);
               }
            }

            let recipeCards = document.querySelectorAll('.card-contenu');
            let displayedRecipes = [];
            for (let i = 0; i < recipeCards.length; i++) {
               let card = recipeCards[i];
               if (card.style.display !== 'none') {
                  displayedRecipes.push(card);
               }
            }
            for (let i = 0; i < displayedRecipes.length; i++) {
               let cardTitle = displayedRecipes[i].querySelector('.card-title').textContent.toLowerCase();
               let recipe = null;
               for (let j = 0; j < this.recipes.length; j++) {
                  if (this.recipes[j].name.toLowerCase() === cardTitle) {
                     recipe = this.recipes[j];
                     break;
                  }
               }
               if (!recipe) {
                  continue;
               }
               let hideCard = true;
               for (let j = 0; j < filteredRecipes.length; j++) {
                  if (filteredRecipes[j].id === recipe.id) {
                     hideCard = false;
                     break;
                  }
               }
               displayedRecipes[i].style.display = hideCard ? 'none' : 'block';
            }

            this.filterRecipes();
            this.updateLists();
            this.checkIfNul();
         }
      });
   }

   // Block user to create multiples badges if already exist
   badgeAlreadyExists(element, type) {
      let badgeContainer = document.querySelector('.container-badge');
      let badgeExists = Array.from(badgeContainer.children).some(badge => {
         return badge.textContent.trim().toLowerCase() === element.toLowerCase() && badge.classList.contains(`btn-${type}`);
      });
      return badgeExists;
   }

   createBadge(element, type) {
      let badgeContainer = document.querySelector('.container-badge');
      if (!this.badgeAlreadyExists(element, type)) {
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

         // Add event listener to filter recipes on badge click
         badge.addEventListener('click', () => {
            // Update selected elements with all currently selected badges of the same type
            let selectedBadges = document.querySelectorAll(`.container-badge .btn-${type}`);
            this.selectedElements[type] = Array.from(selectedBadges).map(badge => badge.textContent.trim().toLowerCase());
            // Filter recipes
            this.filterRecipes();
         });

         // Add class to badge to identify type
         badge.classList.add(`btn-${type}`);

         // Update the list of ingredients, appliances, utensils to include badge element
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

         // Filter the recipes based on the new selection
         this.filterRecipes();
      }
   }

   filterRecipes() {
      let recipeCards = document.querySelectorAll('.card-contenu');
      let selectedIngredients = this.selectedElements.ingredients;
      let selectedAppliances = this.selectedElements.appliances;
      let selectedUstensils = this.selectedElements.ustensils;
      let searchValue = document.querySelector('#floatingInput').value.toLowerCase();

      // New arrays for filtered Element (to display it after input search)
      let filteredIngredients = [];
      let filteredAppliances = [];
      let filteredUstensils = [];

      for (let i = 0; i < recipeCards.length; i++) {
         let card = recipeCards[i];
         let recipe = this.recipes.find(recipe => recipe.name.toLowerCase() === card.querySelector('.card-title').textContent.toLowerCase());
         if (!recipe) {
            continue;
         }
         let hideCard = false;
         if (selectedIngredients.length > 0) {
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
            hideCard = !selectedUstensils.every(selectedUstensil => {
               return recipe.ustensils.some(ustensil => {
                  return ustensil.toLowerCase() === selectedUstensil;
               });
            });
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
            for (let i = 0; i < recipe.ingredients.length; i++) {
               let ingredientName = recipe.ingredients[i].ingredient.toLowerCase();
               if (!filteredIngredients.includes(ingredientName)) {
                  filteredIngredients.push(ingredientName);
               }
            }
            if (selectedAppliances.length === 0 || recipe.appliance.toLowerCase() === selectedAppliances[0]) {
               filteredAppliances.push(recipe.appliance.toLowerCase());
            }
            for (let i = 0; i < recipe.ustensils.length; i++) {
               let ustensilName = recipe.ustensils[i].toLowerCase();
               if (!filteredUstensils.includes(ustensilName)) {
                  filteredUstensils.push(ustensilName);
               }
            }
         }
         card.style.display = hideCard ? 'none' : 'block';
      }

      filteredIngredients = this.removeDuplicate(filteredIngredients);
      filteredAppliances = this.removeDuplicate(filteredAppliances);
      filteredUstensils = this.removeDuplicate(filteredUstensils);

      // Display filtered list
      this.displayList(filteredIngredients, 'ingredients');
      this.displayList(filteredAppliances, 'appliances');
      this.displayList(filteredUstensils, 'ustensils');
   }

   searchBadges(type) {
      let searchInput = document.querySelector(`#input-${type}`);
      searchInput.addEventListener('keyup', (event) => {
         let searchValue = event.target.value.toLowerCase();
         let elements;
         if (type === 'ingredients') {
            elements = this.ingredients.filter(element => element.includes(searchValue));
         } else if (type === 'appliances') {
            elements = this.appliances.filter(element => element.includes(searchValue));
         } else {
            elements = this.ustensils.filter(element => element.includes(searchValue));
         }

         this.displayList(elements, type);
      });
   }

   updateLists() {
      // Get all currently displayed recipes
      let recipeCards = document.querySelectorAll('.card-contenu');
      let displayedRecipes = Array.from(recipeCards).filter(card => {
         return card.style.display !== 'none';
      });

      // Get all ingredients, appliances, and ustensils from displayed recipes
      let filteredIngredients = [];
      let filteredAppliances = [];
      let filteredUstensils = [];

      for (let i = 0; i < displayedRecipes.length; i++) {
         let cardTitle = displayedRecipes[i].querySelector('.card-title').textContent.toLowerCase();
         for (let j = 0; j < this.recipes.length; j++) {
            if (this.recipes[j].name.toLowerCase() === cardTitle) {
               let recipeData = this.recipes[j];
               for (let k = 0; k < recipeData.ingredients.length; k++) {
                  let ingredientName = recipeData.ingredients[k].ingredient.toLowerCase();
                  if (!filteredIngredients.includes(ingredientName)) {
                     filteredIngredients.push(ingredientName);
                  }
               }
               let applianceName = recipeData.appliance.toLowerCase();
               if (!filteredAppliances.includes(applianceName)) {
                  filteredAppliances.push(applianceName);
               }
               for (let l = 0; l < recipeData.ustensils.length; l++) {
                  let ustensilName = recipeData.ustensils[l].toLowerCase();
                  if (!filteredUstensils.includes(ustensilName)) {
                     filteredUstensils.push(ustensilName);
                  }
               }
               break;
            }
         }
      }

      this.displayList(filteredIngredients, 'ingredients');
      this.displayList(filteredAppliances, 'appliances');
      this.displayList(filteredUstensils, 'ustensils');
   }

   // If no result, display an error message in badge and body
   // "Aucun résultat disponible avec les filtres sélectionnés"
   checkIfNul() {
      let recipeCards = document.querySelectorAll('.card-contenu');
      let numHiddenCards = 0;

      for (let i = 0; i < recipeCards.length; i++) {
         let card = recipeCards[i];
         if (card.style.display === 'none') {
            numHiddenCards++;
         }
      }

      if (numHiddenCards === recipeCards.length) {
         for (let i = 0; i < document.querySelectorAll('.no-results').length; i++) {
            document.querySelectorAll('.no-results')[i].classList.remove('d-none');
         }
      } else {
         for (let i = 0; i < document.querySelectorAll('.no-results').length; i++) {
            document.querySelectorAll('.no-results')[i].classList.add('d-none');
         }
      }
   }
}
export default RecipeList; 