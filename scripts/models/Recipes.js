import CreateCard from './Cards.js';

class RecipeList {
  constructor (recipes) {
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

  boucleArray () {
    for (let i = 0; i < this.recipes.length; i++) {
      // Get element for recipes
      const ingredientList = this.recipes[i].ingredients;
      const ustensilsList = this.recipes[i].ustensils;

      // Create array for ingredients, quantity and unit
      const ingredients = [];
      const quantity = [];
      const unit = [];

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
      const card = new CreateCard(this.recipes[i].name, this.recipes[i].time || '< 1', this.recipes[i].description, ingredients, quantity, unit);
      card.createCardItem();
    }
  }

  removeDuplicate (elements) {
    return elements.filter((element, index) => {
      return elements.indexOf(element) === index;
    });
  }

  displayList (elements, name) {
    const listContainer = document.querySelector(`#result-menu-${name} .row`);
    listContainer.innerHTML = '';
    const uniqueElements = this.removeDuplicate(elements);
    for (let i = 0; i < uniqueElements.length; i++) {
      const element = uniqueElements[i];
      const div = document.createElement('div');
      div.classList.add('col-sm-6', 'col-md-4');
      div.innerHTML = element;
      div.addEventListener('click', () => {
        this.createBadge(element, name);
      });
      listContainer.appendChild(div);
    }
  }

  displayAllLists () {
    this.boucleArray();
    this.displayList(this.ingredients, 'ingredients');
    this.displayList(this.appliances, 'appliances');
    this.displayList(this.ustensils, 'ustensils');

    this.searchBadges('ingredients');
    this.searchBadges('appliances');
    this.searchBadges('ustensils');
  }

  // Object Array methods
  searchRecipe () {
    const searchInput = document.querySelector('#floatingInput');
    searchInput.addEventListener('keyup', (event) => {
      if (event.target.value.length >= 3 || event.target.value.length === 0) {
        const searchValue = event.target.value.toLowerCase();
        const searchResults = this.recipes.filter(recipe =>
          recipe.name.toLowerCase().includes(searchValue) ||
               recipe.description.toLowerCase().includes(searchValue) ||
               recipe.appliance.toLowerCase().includes(searchValue) ||
               recipe.ingredients.some(ingredient =>
                 ingredient.ingredient.toLowerCase().includes(searchValue)
               ) ||
               recipe.ustensils.some(ustensil =>
                 ustensil.toLowerCase().includes(searchValue)
               )
        );

        // get all selected badges
        const selectedBadges = Array.from(document.querySelectorAll('.container-badge button'));

        // filter recipes based on searchValue and selected badges
        const filteredRecipes = searchResults.filter(recipe => {
          const matchesSearchValue = true;
          let matchesSelectedBadges = true;

          if (selectedBadges.length > 0) {
            const selectedIngredients = selectedBadges.filter(badge => badge.classList.contains('btn-primary'))
              .map(badge => badge.textContent.trim().toLowerCase());
            const selectedAppliances = selectedBadges.filter(badge => badge.classList.contains('btn-success'))
              .map(badge => badge.textContent.trim().toLowerCase());
            const selectedUstensils = selectedBadges.filter(badge => badge.classList.contains('btn-danger'))
              .map(badge => badge.textContent.trim().toLowerCase());

            if (selectedIngredients.length > 0) {
              matchesSelectedBadges = recipe.ingredients.some(ingredient =>
                selectedIngredients.includes(ingredient.ingredient.toLowerCase())
              );
            }
            if (selectedAppliances.length > 0) {
              matchesSelectedBadges = recipe.appliance.toLowerCase().includes(selectedAppliances[0]);
            }
            if (selectedUstensils.length > 0) {
              matchesSelectedBadges = recipe.ustensils.some(ustensil =>
                selectedUstensils.includes(ustensil.toLowerCase())
              );
            }
          }

          return matchesSearchValue && matchesSelectedBadges;
        });

        const recipeCards = Array.from(document.querySelectorAll('.card-contenu'));
        const displayedRecipes = recipeCards.filter(card => card.style.display !== 'none');
        displayedRecipes.forEach(card => {
          const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
          const recipe = this.recipes.find(recipe => recipe.name.toLowerCase() === cardTitle);
          if (!recipe) {
            return;
          }
          const hideCard = !filteredRecipes.includes(recipe);
          card.style.display = hideCard ? 'none' : 'block';
        });

        this.filterRecipes();
        this.updateLists();
        this.checkIfNul();
      }
    });
  }

  badgeAlreadyExists (element, type) {
    const badgeContainer = document.querySelector('.container-badge');
    const badgeExists = Array.from(badgeContainer.children).some(badge => {
      return badge.textContent.trim().toLowerCase() === element.toLowerCase() && badge.classList.contains(`btn-${type}`);
    });
    return badgeExists;
  }

  createBadge (element, type) {
    const badgeContainer = document.querySelector('.container-badge');
    if (!this.badgeAlreadyExists(element, type)) {
      const badge = document.createElement('button');
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
      const closeBtn = badge.querySelector('img');
      closeBtn.addEventListener('click', () => {
        badge.remove();
        const index = this.selectedElements[type].indexOf(element.toLowerCase());
        if (index !== -1) {
          this.selectedElements[type].splice(index, 1);
          this.filterRecipes();
        }
      });

      // add event listener to filter recipes on badge click
      badge.addEventListener('click', () => {
        // update selected elements with all currently selected badges of the same type
        const selectedBadges = document.querySelectorAll(`.container-badge .btn-${type}`);
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

  filterRecipes () {
    const recipeCards = document.querySelectorAll('.card-contenu');
    const selectedIngredients = this.selectedElements.ingredients;
    const selectedAppliances = this.selectedElements.appliances;
    const selectedUstensils = this.selectedElements.ustensils;
    const searchValue = document.querySelector('#floatingInput').value.toLowerCase();

    let filteredIngredients = [];
    let filteredAppliances = [];
    let filteredUstensils = [];

    for (let i = 0; i < recipeCards.length; i++) {
      const card = recipeCards[i];
      const recipe = this.recipes.find(recipe => recipe.name.toLowerCase() === card.querySelector('.card-title').textContent.toLowerCase());
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
          const ingredientName = recipe.ingredients[i].ingredient.toLowerCase();
          if (!filteredIngredients.includes(ingredientName)) {
            filteredIngredients.push(ingredientName);
          }
        }
        if (selectedAppliances.length === 0 || recipe.appliance.toLowerCase() === selectedAppliances[0]) {
          filteredAppliances.push(recipe.appliance.toLowerCase());
        }
        for (let i = 0; i < recipe.ustensils.length; i++) {
          const ustensilName = recipe.ustensils[i].toLowerCase();
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

    this.displayList(filteredIngredients, 'ingredients');
    this.displayList(filteredAppliances, 'appliances');
    this.displayList(filteredUstensils, 'ustensils');
  }

  searchBadges (type) {
    const searchInput = document.querySelector(`#input-${type}`);
    searchInput.addEventListener('keyup', (event) => {
      const searchValue = event.target.value.toLowerCase();
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

  updateLists () {
    // get all currently displayed recipes
    const recipeCards = document.querySelectorAll('.card-contenu');
    const displayedRecipes = Array.from(recipeCards).filter(card => {
      return card.style.display !== 'none';
    });

    // get all ingredients, appliances, and ustensils from displayed recipes
    const filteredIngredients = [];
    const filteredAppliances = [];
    const filteredUstensils = [];

    for (let i = 0; i < displayedRecipes.length; i++) {
      const cardTitle = displayedRecipes[i].querySelector('.card-title').textContent.toLowerCase();
      for (let j = 0; j < this.recipes.length; j++) {
        if (this.recipes[j].name.toLowerCase() === cardTitle) {
          const recipeData = this.recipes[j];
          for (let k = 0; k < recipeData.ingredients.length; k++) {
            const ingredientName = recipeData.ingredients[k].ingredient.toLowerCase();
            if (!filteredIngredients.includes(ingredientName)) {
              filteredIngredients.push(ingredientName);
            }
          }
          const applianceName = recipeData.appliance.toLowerCase();
          if (!filteredAppliances.includes(applianceName)) {
            filteredAppliances.push(applianceName);
          }
          for (let l = 0; l < recipeData.ustensils.length; l++) {
            const ustensilName = recipeData.ustensils[l].toLowerCase();
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

  checkIfNul () {
    const recipeCards = document.querySelectorAll('.card-contenu');
    let numHiddenCards = 0;

    for (let i = 0; i < recipeCards.length; i++) {
      const card = recipeCards[i];
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
