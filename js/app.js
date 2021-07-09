/**
----------------------
formulaire de contact
photographe
----------------------
*/

document.addEventListener('DOMContentLoaded', () => {
const declencheurs = document.querySelectorAll('[aria-haspopup="dialog"]');
const doc = document.querySelector('.js-document');

const ouvrir = function(dialog){
    dialog.setAttribute('aria-hidden', false);
    document.setAttribute('aria-hidden', true);
};

declencheurs.forEach((declencheur) => {
const dialog = document.getElementById(declencheur.getAttribute('aria-controls'));

//ouvrir dialogue

declencheur.addEventListener('click,' (e) => {
    e.preventDefault();

    ouvrir(dialog);
    });
});
});
