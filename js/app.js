/**
----------------------
formulaire de contact
photographe
----------------------
*/

document.addEventListener('DOMContentLoaded', () => {
  const declencheurs = document.querySelectorAll('[aria-haspopup="modale-formulaire"]')
  const docGeneral = document.querySelector('.js-document')

  const ouvrir = function (dialog) {
    dialog.setAttribute('aria-hidden', false)
    docGeneral.setAttribute('aria-hidden', true)
  }

  const fermer = function (dialog) {
    dialog.setAttribute('aria-hidden', true)
    docGeneral.setAttribute('aria-hidden', false)
  }

  declencheurs.forEach((declencheur) => {
    const dialog = document.getElementById(declencheur.getAttribute('aria-controls'))
    const rejetDeclencheurs = dialog.querySelectorAll('[data-dismiss]')

    // ouvrir dialogue
    declencheur.addEventListener('click', (e) => {
      e.preventDefault()

      ouvrir(dialog)
    })

    // fermer diaolgue
    rejetDeclencheurs.forEach((rejetDeclencheur) => {
      const rejetDialog = document.getElementById(rejetDeclencheur.dataset.dismiss)

      rejetDeclencheur.addEventListener('click', (e) => {
        e.preventDefault()

        fermer(rejetDialog)
      })
    })
    window.addEventListener('click', (e) => {
      if (e.target === dialog) {
        close(dialog)
      }
    })
  })
})
