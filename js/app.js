/**
----------------------
lightbox
----------------------
*/

/**
----------------------
formulaire de contact
photographe
----------------------
*/

// éléments du DOM
const corpsBody = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')
const corpsFormulaire = document.querySelector('.modale-formulaire')
const btnOuvrirFormulaire = document.querySelector('#btn-modale')
const btnFermerFormulaire = document.querySelector('.modale-formulaire .btn-fermeture')
// gestion clavier
const touchesClavier = {
      tab: 9,
      enter: 13,
      echap: 27
    }

// OUVERTURE accessible du formulaire
function formulaireOuverture() {
  corpsContenuPage.setAttribute('aria-hidden', 'true')
  corpsFormulaire.setAttribute('aria-hidden','false')
  corpsBody.style.overflow = 'hidden'
  btnFermerFormulaire.focus()
}
btnOuvrirFormulaire.addEventListener('click', formulaireOuverture);

// FERMETURE accessible du formulaire
function formulaireFermeture() {
  corpsContenuPage.setAttribute('aria-hidden', 'false')
  corpsFormulaire.setAttribute('aria-hidden','true')
  corpsBody.style.overflow = 'scroll'
  btnOuvrirFormulaire.focus()
}
btnFermerFormulaire.addEventListener('click', formulaireFermeture);

// gestion au clavier
corpsFormulaire.addEventListener('keydown', (e) => {
        if (e.which === touchesClavier.echap) {
          formulaireFermeture()
        }
      })


// document.addEventListener('DOMContentLoaded', () => {
//   // éléments du DOM
//   const declencheurs = document.querySelectorAll('.btn-formulaire[aria-haspopup="dialog"]')
//   const docGeneral = document.querySelector('.js-document')
//   const tableauElementsFocusables = [
//     '[href]',
//     'button:not([disabled])',
//     'input:not([disabled])',
//     'select:not([disabled])',
//     'textarea:not([disabled])',
//     '[tabindex]:not([tabindex="-1"])'
//   ]
//   // const formPrenom = document.getElementById('prenom')
//   // const formNom = document.getElementById('nom')
//   // const formMail = document.getElementById('email')
//   // const btnEnvoiFormulaire = document.getElementById('btn-envoi')

//   // contrôles clavier
//   const touchesClavier = {
//     tab: 9,
//     enter: 13,
//     echap: 27
//   }

//   // regex formulaire
//   // const regexNom = /^(?=[a-zA-ZéèîïÉÎÏ\s]{2,25}$)(?=[a-zA-Z\s])(?:([\w\s*?])\1?(?!\1))+$/
//   // const regexAdresseMail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

//   const ouvrir = function (dialog) {
//     const elementsFocusables = dialog.querySelectorAll(tableauElementsFocusables)
//     const premierElementFocusable = elementsFocusables[0]
//     const dernierElementFocusable = elementsFocusables[elementsFocusables.length - 1]

//     dialog.setAttribute('aria-hidden', false)
//     docGeneral.setAttribute('aria-hidden', true)

//     // return si pas d'élément focusable
//     if (!premierElementFocusable) {
//       return
//     }

//     window.setTimeout(() => {
//       premierElementFocusable.focus()

//       // focus à l'intérieur de la modale
//       elementsFocusables.forEach((elementFocusable) => {
//         if (elementFocusable.addEventListener) {
//           elementFocusable.addEventListener('keydown', (e) => {
//             const tab = e.which === touchesClavier.tab

//             if (!tab) {
//               return
//             }

//             if (e.shiftKey) {
//               if (e.target === premierElementFocusable) { // shift + tab
//                 e.preventDefault()

//                 dernierElementFocusable.focus()
//               }
//             } else if (event.target === dernierElementFocusable) { // tab
//               event.preventDefault()

//               premierElementFocusable.focus()
//             }
//           })
//         }
//       })
//     }, 100)
//   }

//   const fermer = function (dialog, declencheur) {
//     dialog.setAttribute('aria-hidden', true)
//     docGeneral.setAttribute('aria-hidden', false)

//     // restaurer le focus
//     declencheur.focus()
//   }

//   declencheurs.forEach((declencheur) => {
//     const dialog = document.getElementById(declencheur.getAttribute('aria-controls'))
//     const rejetDeclencheurs = dialog.querySelectorAll('[data-dismiss]')

//     // ouvrir dialogue
//     declencheur.addEventListener('click', (e) => {
//       e.preventDefault()

//       ouvrir(dialog)
//     })

//     declencheur.addEventListener('keydown', (e) => {
//       if (e.which === touchesClavier.enter) {
//         e.preventDefault()

//         open(dialog)
//       }
//     })

//     // fermer diaolgue

//     dialog.addEventListener('keydown', (e) => {
//       if (e.which === touchesClavier.echap) {
//         close(dialog, declencheur)
//       }
//     })

//     rejetDeclencheurs.forEach((rejetDeclencheur) => {
//       const rejetDialog = document.getElementById(rejetDeclencheur.dataset.dismiss)

//       rejetDeclencheur.addEventListener('click', (e) => {
//         e.preventDefault()

//         fermer(rejetDialog, declencheur)
//       })
//     })

//     window.addEventListener('click', (e) => {
//       if (e.target === dialog) {
//         close(dialog)
//       }
//     })
//   })

  // // Vérification des champs de saisie et messages d'erreur
  // function validerPrenom () {
  //   if (regexNom.test(formPrenom.value) == true) {
  //     formPrenom.style.borderColor = 'black'
  //     messageErreur[0].textContent = ' '
  //     return true
  //   } else if (!formPrenom.value) {
  //     // message d'erreur de champ vide :
  //     messageErreur[0].textContent = 'Ce champ est obligatoire.'
  //     formPrenom.style.borderColor = '#ff0000'
  //     return false
  //   } else {
  //     // message d'erreur de champ inccorect :
  //     messageErreur[0].textContent = 'Veuillez saisir un prénom valide.'
  //     formPrenom.style.borderColor = '#ff0000'
  //     return false
  //   }
  // }

  // function validerNom () {
  //   if (regexNom.test(formNom.value) == true) {
  //     formNom.style.borderColor = 'black'
  //     messageErreur[0].textContent = ' '
  //     return true
  //   } else if (!formNom.value) {
  //     // message d'erreur de champ vide :
  //     messageErreur[0].textContent = 'Ce champ est obligatoire.'
  //     formNom.style.borderColor = '#ff0000'
  //     return false
  //   } else {
  //     // message d'erreur de champ inccorect :
  //     messageErreur[0].textContent = 'Veuillez saisir un nom valide.'
  //     formNom.style.borderColor = '#ff0000'
  //     return false
  //   }
  // }

//   // vérification des champs
//   btnEnvoiFormulaire.addEventListener('click', function (e) {
//     e.preventDefault()

//     const prenomValide = validerPrenom()
//     const nomValide = validerNom()
//     const mailValide = validerMail()

//     const champsTousValides = prenomValide && nomValide && mailValide &&
//     MessageValide

//     // affichage fenêtre de confirmation d'envoi
//     if (champsTousValides) {
//       modaleMessageConfirmation.style.display = 'flex'
//       modaleFormulaire.style.display = 'none'
//       console.log('Formulaire envoyé.')

//     // blocage de l'envoi du formulaire non valide
//     } else {
//       console.log('Formulaire non validé.')
//       return false
//     }
//   })
// })
