class Display {
   constructor(container, input, result, arrow, placeholder) {
      this.container = document.getElementById(container);
      this.container_gp = this.container.parentElement.parentElement;
      this.input = document.getElementById(input);
      this.result = document.getElementById(result);
      this.arrow = document.querySelector(arrow);

      // placeholder
      this.placeholder = placeholder;
      this.placeholder_search = "Rechercher un " + placeholder;
   }

   toggleResultMenu() {
      this.result.classList.toggle("d-none");
      this.container_gp.classList.toggle("col-md-6");
      this.input.placeholder = this.result.classList.contains("d-none") ? this.placeholder : this.placeholder_search;
      this.arrow.classList.toggle("rotate-img_event");
   }

   hideResultMenu() {
      this.result.classList.add("d-none");
      this.container_gp.classList.remove("col-md-6");
      this.input.placeholder = this.placeholder;
   }
}
export default Display;