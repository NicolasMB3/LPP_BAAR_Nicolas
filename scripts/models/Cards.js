class CreateCard {

   static init() {

      // Need more test to improve this function
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
   }

   constructor(title, time, description, ingredient, quantity, unit) {
      this.title = title;
      this.time = time;
      this.description = description;
      this.ingredient = ingredient;
      this.quantity = quantity;
      this.unit = unit;
   }

   createCardItem() {
      // Build Container
      const divCol = document.createElement('div');
      divCol.classList.add('col-sm', 'col-md-6', 'col-lg-4');

      const divCard = document.createElement('div');
      divCard.classList.add('card', 'border-0');
      divCard.style.width = '100%';

      const divCardImgTop = document.createElement('div');
      divCardImgTop.classList.add('card-img-top', 'bg-color', 'bg-primary-subtle');

      // Append elements to container
      divCol.appendChild(divCard);
      divCard.appendChild(divCardImgTop);

      // Build card body
      const divCardBody = document.createElement('div');
      divCardBody.classList.add('card-body', 'rounded-bottom');

      // Build title and time (minutes to cook)
      const dFlexJTMB = document.createElement('div');
      dFlexJTMB.classList.add('d-flex', 'justify-content-between', 'mb-3', 'card-header-content');

      const h5CardTitle = document.createElement('h5');
      h5CardTitle.classList.add('card-title', 'text-start');
      h5CardTitle.textContent = this.title;

      const w50CardTitle = document.createElement('div');
      w50CardTitle.classList.add('w-50', 'card-title', 'd-flex', 'justify-content-end', 'align-items-center');

      const imgTime = document.createElement('img');
      imgTime.setAttribute('src', 'img/time.svg');
      imgTime.setAttribute('alt', 'Temps de préparation');

      const ps2 = document.createElement('p');
      ps2.classList.add('text-start', 'mb-0', 'ps-2');
      ps2.textContent = this.time + ' min';

      // Card content
      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content', 'd-flex', 'justify-content-between');

      const dFlexFC = document.createElement('div');
      dFlexFC.classList.add('d-flex', 'flex-column', 'text-start', 'card-description');

      // Get ingredients list from the recipe
      for (let i = 0; i < this.ingredient.length; i++) {
         const pIngredient = document.createElement('p');
         pIngredient.classList.add('mb-0');
         pIngredient.innerHTML = `<span class="fw-bold">${this.ingredient[i]} :</span> ${this.quantity[i]} ${this.unit[i]}`;
         dFlexFC.appendChild(pIngredient);
      }

      const w50 = document.createElement('p');
      w50.classList.add('text-start', 'w-50');
      w50.textContent = this.description;

      // Append elements to card body
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(dFlexJTMB);
      dFlexJTMB.appendChild(h5CardTitle);
      dFlexJTMB.appendChild(w50CardTitle);
      w50CardTitle.appendChild(imgTime);
      w50CardTitle.appendChild(ps2);
      divCardBody.appendChild(cardContent);
      cardContent.appendChild(dFlexFC);
      cardContent.appendChild(w50);

      document.getElementById('container-card').appendChild(divCol);
   }
}
export default CreateCard; 