/**
----------------------
lightbox
----------------------
*/
///////////////
// VARIABLES //
///////////////
// éléments du DOM
const photoVignette = document.querySelectorAll('.apercu-photo')


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

const formChamps = document.querySelectorAll('.text-control')
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
  // créer une variable pour les messages d'erreur ? :
  // intégrer nom de l'input concerné et case en rouge
  let typeErreur
  e.preventDefault()

  for (let i = 0; i < formChamps.length; i++) {
     if (!formChamps[i].value) {
      typeErreur = "Veuillez renseigner tous les champs."

      console.log(`veuillez remplir le champ ${i}`)
    } if (i <= 1 && regexNom.test(i.value) == false) {
      typeErreur = "Veuillez saisir un nom valide."  
    }

    if (typeErreur) {
      messageErreur.innerHTML = typeErreur;
      messageErreur.classList.add('erreur-saisie--active')
    }
  }
})