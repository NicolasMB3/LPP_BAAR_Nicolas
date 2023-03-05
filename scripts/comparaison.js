function Native() {
   let searchValue = "chocolat";
   let searchResults = [];
   for (let i = 0; i < recipes.length; i++) {
      let recipe = recipes[i];
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
   return searchResults;
}

function Object() {
   let searchValue = "chocolat";
   let result = recipes.filter(recipe =>
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
   return result;
}

let iterations = 100;

// Mesure du temps d'exécution pour la fonction Native
let nativeStartTime = performance.now();
for (let i = 0; i < iterations; i++) {
   Native();
}
let nativeEndTime = performance.now();
let nativeTime = nativeEndTime - nativeStartTime;

// Mesure du temps d'exécution pour la fonction Object
let objectStartTime = performance.now();
for (let i = 0; i < iterations; i++) {
   Object();
}
let objectEndTime = performance.now();
let objectTime = objectEndTime - objectStartTime;

document.getElementById('native').innerHTML = `${(Math.round(nativeTime * 100) / 100).toFixed(2)}ms`;
document.getElementById('object').innerHTML = `${(Math.round(objectTime * 100) / 100).toFixed(2)}ms`;