// enable bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const links = document.querySelectorAll('#navigator a');

links.forEach((link) => {
   link.addEventListener('mouseover', () => {
      // set the 'active' class on the hovered element
      link.classList.add('active');

      // remove the 'active' class from all other elements
      links.forEach((otherLink) => {
         if (otherLink !== link) {
            otherLink.classList.remove('active');
         }
      });
   });
});