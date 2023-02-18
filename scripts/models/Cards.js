class CreateCard {
   constructor(title, time, description, ingredient, quantity, unit) {
      this.title = title;
      this.time = time;
      this.description = description;
      this.ingredient = ingredient;
      this.quantity = quantity;
      this.unit = unit;
   }

   createCardItem() {
      let divCol = document.createElement('div');
      divCol.setAttribute('class', 'col-sm col-md-6 col-lg-4');
      let divCard = document.createElement('div');
      divCard.setAttribute('class', 'card border-0');
      divCard.style.width = '100%';
      let divCardImgTop = document.createElement('div');
      divCardImgTop.setAttribute('class', 'card-img-top bg-color bg-primary-subtle');
      let divCardBody = document.createElement('div');
      divCardBody.setAttribute('class', 'card-body rounded-bottom');
      let dFlexJTMB = document.createElement('div');
      dFlexJTMB.setAttribute('class', 'd-flex justify-content-between mb-3 card-header-content');
      let h5CardTitle = document.createElement('h5');
      h5CardTitle.setAttribute('class', 'card-title text-start');
      h5CardTitle.innerHTML = this.title;
      let w50CardTitle = document.createElement('div');
      w50CardTitle.setAttribute('class', 'w-50 card-title d-flex justify-content-end align-items-center');
      let imgTime = document.createElement('img');
      imgTime.setAttribute('src', 'img/time.svg');
      imgTime.setAttribute('alt', 'Temps de préparation');
      let ps2 = document.createElement('p');
      ps2.setAttribute('class', 'text-start mb-0 ps-2');
      ps2.innerHTML = this.time + ' min';

      let cardContent = document.createElement('div');
      cardContent.setAttribute('class', 'card-content d-flex justify-content-between');
      let dFlexFC = document.createElement('div');
      dFlexFC.setAttribute('class', 'd-flex flex-column text-start card-description');

      // Get ingredients list from the recipe
      for (let i = 0; i < this.ingredient.length; i++) {
         let pIngredient = document.createElement('p');
         pIngredient.classList.add('mb-0');
         pIngredient.innerHTML = `<span class="fw-bold">${this.ingredient[i]} :</span> ${this.quantity[i]} ${this.unit[i]}`;
         dFlexFC.appendChild(pIngredient);
      }

      let w50 = document.createElement('p');
      w50.setAttribute('class', 'text-start w-50');
      w50.innerHTML = this.description;

      // Appending Elements
      divCol.appendChild(divCard);
      divCard.appendChild(divCardImgTop);
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