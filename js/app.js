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

///////////////
// VARIABLES //
///////////////
// éléments du DOM
const corpsBody = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')
const corpsFormulaire = document.querySelector('.modale-formulaire')
const contenuFormulaire = document.querySelector('.formulaire-contenu')
const btnOuvrirFormulaire = document.querySelector('#btn-modale')
const btnFermerFormulaire = document.querySelector('.modale-formulaire .btn-fermeture')

const formChamps = document.querySelectorAll('.champ-formulaire')
const formPrenom = document.querySelector('#prenom')
const formNom = document.querySelector('#nom')
const formMail = document.querySelector('#email')
const btnEnvoiFormulaire = document.querySelector('#btn-envoi')
const messageErreur = document.querySelector('.erreur-saisie')
// expressions régulières
const regexNom = /^(?=[a-zA-ZéèîïÉÎÏ\s]{2,25}$)(?=[a-zA-Z\s])(?:([\w\s*?])\1?(?!\1))+$/
const regexMail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

// éléments du clavier
const touchesClavier = {
  tab: 9,
  enter: 13,
  echap: 27
}

const tableauChampsFocusables = [
  '[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
]
const champsFocusables = contenuFormulaire.querySelectorAll(tableauChampsFocusables)
const premierElementFocusable = champsFocusables[0]
const dernierElementFocusable = champsFocusables[champsFocusables.length - 1]

/////////////////////////////////////
// OUVERTURE ACCESSIBLE FORMULAIRE //
/////////////////////////////////////
function formulaireOuverture() {
  corpsContenuPage.setAttribute('aria-hidden', 'true')
  corpsFormulaire.setAttribute('aria-hidden','false')
  corpsBody.style.overflow = 'hidden'
  premierElementFocusable.focus()
}
btnOuvrirFormulaire.addEventListener('click', formulaireOuverture);

/////////////////////////////////////
// FERMETURE ACCESSIBLE FORMULAIRE //
/////////////////////////////////////
function formulaireFermeture() {
  corpsContenuPage.setAttribute('aria-hidden', 'false')
  corpsFormulaire.setAttribute('aria-hidden','true')
  corpsBody.style.overflow = 'scroll'
  btnOuvrirFormulaire.focus()
}
btnFermerFormulaire.addEventListener('click', formulaireFermeture);

///////////////////////////
// NAVIGATION AU CLAVIER //
///////////////////////////

// quitter avec échap
corpsFormulaire.addEventListener('keydown', (e) => {
  if (e.which === touchesClavier.echap) {
    formulaireFermeture()
  }
})

// gestion du focus avec tab
window.setTimeout(() => {
  // focus à l'intérieur de la modale
  champsFocusables.forEach((champsFocusable) => {
    if (champsFocusable.addEventListener) {
      champsFocusable.addEventListener('keydown', (e) => {
        const tab = e.which === touchesClavier.tab

        if (!tab) {
          return
        }

        if (e.touchesClavier) {
          if (e.target === premierElementFocusable) { // shift + tab
            e.preventDefault()

            dernierElementFocusable.focus()
          }
        } else if (e.target === dernierElementFocusable) { // tab
          e.preventDefault()

          premierElementFocusable.focus()
        }
      })
    }
  })
}, 100)

//////////////////////////
// GESTION DE LA SAISIE //
//////////////////////////

btnEnvoiFormulaire.addEventListener('click', function (e) {
  // créer une variable pour les messages d'erreur :
  // intégrer nom de l'input concerné et case en rouge
  e.preventDefault()

  // si un des champs est vide :
  if (!formChamps.value) {
    messageErreur.textContent = 'Veuillez remplir tous les champs.'
    messageErreur.classList.add('erreur-saisie--active')
    return false
  // si les noms ont des formats valides
  } else if (regexNom.test(formChamps[0 - 1].value) !== true) {
  	messageErreur.textContent = 'Veuillez remplir un nom / prénom valide.'
  	return false
  // si le mail est valide
  } else if (regexMail.test(formChamps[2].value) !== true) {
  	messageErreur.textContent = 'Veuillez remplir un email valide.'
  } else{
    messageErreur.textContent = ' '
  	return true
  }
})