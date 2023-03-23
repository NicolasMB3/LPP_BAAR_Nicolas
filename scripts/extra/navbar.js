/* eslint-disable no-unused-vars */
// Enable bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// eslint-disable-next-line no-undef
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const links = document.querySelectorAll('#navigator a');

links.forEach((link) => {
  link.addEventListener('mouseover', () => {
    // Set the 'active' class on the hovered element
    link.classList.add('active');

    // Remove the 'active' class from all other elements
    links.forEach((otherLink) => {
      if (otherLink !== link) {
        otherLink.classList.remove('active');
      }
    });
  });
});
