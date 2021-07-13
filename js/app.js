/**
----------------------
GÉNÉRAL
----------------------
*/

// éléments du DOM
const corpsBody = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

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

/**
----------------------
formulaire de contact
photographe

TODO :
- Afficher ds la console
les données envoyées
----------------------
*/

// éléments du DOM
const corpsFormulaire = document.querySelector('.modale-formulaire')
const contenuFormulaire = document.querySelector('.formulaire-contenu')
const btnOuvrirFormulaire = document.querySelector('#btn-modale')
const btnFermerFormulaire = document.querySelector('.modale-formulaire .btn-fermeture')

const formChamps = document.forms['formulaire-contact']
const btnEnvoiFormulaire = document.querySelector('#btn-envoi')
const messageErreur = document.querySelector('.erreur-saisie')

// expressions régulières
const regexNom = /^(?=[a-zA-ZéèîïÉÎÏ\s]{2,25}$)(?=[a-zA-Z\s])(?:([\w\s*?])\1?(?!\1))+$/
const regexMail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

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
  // intégrer nom de l'input concerné et case en rouge
  let typeErreur
  // vérifier la validité des infos saisies
  if (regexNom.test(formChamps.prenom.value) === false) {
    typeErreur = 'Veuillez saisir un prénom valide.'
  } else if (regexNom.test(formChamps.nom.value) === false) {
    typeErreur = 'Veuillez saisir un nom valide.'
  } else if (regexMail.test(formChamps.email.value) === false) {
    typeErreur = 'Veuillez saisir un email valide.'
  }
  // vérifier que les champs ne sont pas vides
  for (let i = 0; i < formChamps.length; i++) {
    if (!formChamps[i].value) {
      typeErreur = 'Veuillez renseigner tous les champs.'
    }
  }
  // affichage des messages d'erreur
  if (typeErreur) {
    e.preventDefault()
    messageErreur.innerHTML = typeErreur;
    messageErreur.classList.add('erreur-saisie--active')
  } else {
    alert('Formulaire envoyé')
  }
})


/**
----------------------
lightbox
----------------------
*/

// éléments du DOM
const photoVignette = document.querySelectorAll('.apercu-photo')
const corpsLightbox = document.querySelector('.lightbox')
const btnFermerLightbox = document.querySelector('.lightbox .btn-fermeture')

///////////////////////////////////
// OUVERTURE ACCESSIBLE LIGHTBOX //
///////////////////////////////////
function lightboxOuverture () {
  corpsContenuPage.setAttribute('aria-hidden', 'true')
  corpsBody.style.overflow = 'hidden'
  corpsLightbox.setAttribute('aria-hidden', 'false')
  // premierElementFocusable.focus()
}
photoVignette[0].addEventListener('click', lightboxOuverture)

///////////////////////////////////
// FERMETURE ACCESSIBLE LIGHTBOX //
///////////////////////////////////
function lightboxFermeture () {
  corpsContenuPage.setAttribute('aria-hidden', 'false')
  corpsLightbox.setAttribute('aria-hidden','true')
  corpsBody.style.overflow = 'scroll'
  // photoVignette[0].focus()
}
btnFermerLightbox.addEventListener('click', lightboxFermeture);

// corpsLightbox.addEventListener('keydown', (e) => {
//   if (e.which === touchesClavier.echap) {
//     lightboxFermeture()
//   }
// })
