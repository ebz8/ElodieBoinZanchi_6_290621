/**
----------------------
formulaire de contact
photographe
----------------------
*/

document.addEventListener('DOMContentLoaded', () => {
  const declencheurs = document.querySelectorAll('[aria-haspopup="dialog"]')
  const docGeneral = document.querySelector('.js-document')
  const tableauElementsFocusables = [
    '[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
];

  const touchesClavier = {
    tab: 9,
    enter: 13,
    escape: 27,
  };

  const ouvrir = function (dialog) {
    const elementsFocusables = dialog.querySelectorAll(tableauElementsFocusables);
    const premierElementFocusable = elementsFocusables[0];
    const dernierElementFocusable = elementsFocusables[elementsFocusables.length - 1];

    dialog.setAttribute('aria-hidden', false);
    docGeneral.setAttribute('aria-hidden', true);

    // return if no focusable element
  if (!premierElementFocusable) {
    return;
}

window.setTimeout(() => {
    premierElementFocusable.focus();

    // trapping focus inside the dialog
    elementsFocusables.forEach((elementFocusable) => {
      if (elementFocusable.addEventListener) {
        elementFocusable.addEventListener('keydown', (e) => {
          const tab = e.which === touchesClavier.tab;

          if (!tab) {
            return;
          }

          if (e.shiftKey) {
            if (e.target === premierElementFocusable) { // shift + tab
              e.preventDefault();

              dernierElementFocusable.focus();
            }
          } else if (event.target === dernierElementFocusable) { // tab
            event.preventDefault();

            premierElementFocusable.focus();
          }
        });
      }
    });
  }, 100);
};

  const fermer = function (dialog, declencheur) {
    dialog.setAttribute('aria-hidden', true);
    docGeneral.setAttribute('aria-hidden', false);

    //restaurer le focus
    declencheur.focus();
};

  declencheurs.forEach((declencheur) => {
    const dialog = document.getElementById(declencheur.getAttribute('aria-controls'))
    const rejetDeclencheurs = dialog.querySelectorAll('[data-dismiss]')

    // ouvrir dialogue
    declencheur.addEventListener('click', (e) => {
      e.preventDefault()

      ouvrir(dialog)
    })

    declencheur.addEventListener('keydown', (e) =>{
        if(e.which === touchesClavier.enter){
        e.preventDefault();

        open(dialog);
    }
});

    // fermer diaolgue

    dialog.addEventListener('keydown', (e) => {
        if (e.which === touchesClavier.escape) {
        close(dialog, declencheur)
        }
    });

    rejetDeclencheurs.forEach((rejetDeclencheur) => {
      const rejetDialog = document.getElementById(rejetDeclencheur.dataset.dismiss)

      rejetDeclencheur.addEventListener('click', (e) => {
        e.preventDefault()

        fermer(rejetDialog, declencheur)
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target === dialog) {
        close(dialog)
      }
    })
  })
})