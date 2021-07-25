// // Import des composants JS
// import { btnRetourMain } from 'components/retourmain.js'

/**
----------------------
GÉNÉRAL
----------------------
*/

// // récupération des données JSON
// fetch('js/data/fisheyedata.json')
//   .then(reponse => reponse.json())
//   .then(data => console.log(data))
//   .catch(function () {
//     console.log('Erreur dans le chargement des données')
//   })

// éléments du DOM
const corpsBody = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

// éléments du clavier
const touchesClavier = {
  tab: 9,
  enter: 13,
  echap: 27
}


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

// expressions régulières
const regexNom = /^(?=[a-zA-ZéèîïÉÎÏ\s]{2,25}$)(?=[a-zA-Z\s])(?:([\w\s*?])\1?(?!\1))+$/
const regexMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

// //////////////////////////////////
// OUVERTURE ACCESSIBLE FORMULAIRE //
// //////////////////////////////////
function formulaireOuverture () {
  corpsFormulaire.setAttribute('aria-hidden', 'false')
  corpsContenuPage.setAttribute('aria-hidden', 'true')
  corpsBody.style.overflow = 'hidden'
  premierElementFocusable.focus()
  console.log(corpsFormulaire)
}
btnOuvrirFormulaire.addEventListener('click', formulaireOuverture)

// //////////////////////////////////
// FERMETURE ACCESSIBLE FORMULAIRE //
// //////////////////////////////////
function formulaireFermeture () {
  corpsFormulaire.setAttribute('aria-hidden', 'true')
  corpsContenuPage.setAttribute('aria-hidden', 'false')
  corpsBody.style.overflow = 'scroll'
  btnOuvrirFormulaire.focus()
}
btnFermerFormulaire.addEventListener('click', formulaireFermeture)

// ////////////////////////
// NAVIGATION AU CLAVIER //
// ////////////////////////

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

// ///////////////////////
// GESTION DE LA SAISIE //
// ///////////////////////

btnEnvoiFormulaire.addEventListener('click', function (e) {
  e.preventDefault()

  let typeErreur
  // vérifier la validité des infos saisies
  if (regexNom.test(formChamps.prenom.value) === false) {
    typeErreur = 'Veuillez saisir un prénom valide : deux caractères minimum et chiffres interdits.'
  } else if (regexNom.test(formChamps.nom.value) === false) {
    typeErreur = 'Veuillez saisir un nom valide : deux caractères minimum et chiffres interdits.'
  } else if (regexMail.test(formChamps.email.value) === false) {
    typeErreur = 'Veuillez saisir un email valide : doit correspondre au format mail@mail.com.'
  }
  // vérifier que les champs ne sont pas vides
  for (let i = 0; i < formChamps.length; i++) {
    if (!formChamps[i].value) {
      typeErreur = 'Veuillez renseigner tous les champs.'
    }
  }
  // si erreur de saisie, affichage message d'erreur spécifique
  if (typeErreur) {
    e.preventDefault()
    messageErreur.innerHTML = typeErreur
    messageErreur.classList.add('erreur-saisie--active')
  } else {
    // afficher les données saisies puis effacer le formulaire
    for (let i = 0; i < formChamps.length - 1; i++) {
      console.log(formChamps[i].value)
      formChamps[i].value = ''
    }
    messageErreur.innerHTML = ' '
    // message de confirmation et fermeture de la fenêtre
    alert('Votre message a bien été envoyé.')
    formulaireFermeture()
  }
})

/**
----------------------
lightbox
----------------------
*/

// éléments du DOM
const photoVignette = document.querySelectorAll('.apercu-photo img')
const corpsLightbox = document.querySelector('.lightbox')
const elementsLightbox = document.querySelectorAll('.lightbox-element')
const btnFermerLightbox = document.querySelector('.lightbox .btn-fermeture')
const btnPrecedent = document.querySelector('.gauche')
const btnSuivant = document.querySelector('.droite')

// ////////////////////////////////
// OUVERTURE ACCESSIBLE LIGHTBOX //
// ////////////////////////////////
function lightboxOuverture () {
  corpsContenuPage.setAttribute('aria-hidden', 'true')
  corpsBody.style.overflow = 'hidden'
  corpsLightbox.setAttribute('aria-hidden', 'false')
  // premierElementFocusable.focus()
}
photoVignette[0].addEventListener('click', lightboxOuverture)

// //////////////////////
// NAVIGATION LIGHTBOX //
// //////////////////////

// photo suivante
function elementSuivant () {
  let index = 0
  // console.log(elementsLightbox.length)
  console.log(index)

  if (index < elementsLightbox.length) {
    elementsLightbox[index].classList.remove('actif')
    index++
    elementsLightbox[index].classList.add('actif')

    console.log('peut aller au suivant')
  } else if (index === elementsLightbox.length) {
    elementsLightbox[index].classList.remove('actif')
    index = 0
    elementsLightbox[index].classList.add('actif')
    console.log('peut retourner au premier')
  }
}
btnSuivant.addEventListener('click', elementSuivant)

// photo suivante
function elementPrecedent () {
  let index = 0

  if (index > 0) {
    elementsLightbox[index].classList.remove('actif')
    index--
    elementsLightbox[index].classList.add('actif')
  } else if (index === elementsLightbox.length) {
    elementsLightbox[index].classList.remove('actif')
    index = 0
    elementsLightbox[index].classList.add('actif')
  }
}
btnPrecedent.addEventListener('click', elementPrecedent)

// ////////////////////////////////
// FERMETURE ACCESSIBLE LIGHTBOX //
// ////////////////////////////////
function lightboxFermeture () {
  corpsContenuPage.setAttribute('aria-hidden', 'false')
  corpsLightbox.setAttribute('aria-hidden', 'true')
  corpsBody.style.overflow = 'scroll'
  // photoVignette[0].focus()
}
btnFermerLightbox.addEventListener('click', lightboxFermeture)

// corpsLightbox.addEventListener('keydown', (e) => {
//   if (e.which === touchesClavier.echap) {
//     lightboxFermeture()
//   }
// })

/**
-------------------------------------
BOUTON RETOUR AU CONTENU PRINCIPAL
-------------------------------------
*/

// const btnRetourContenuPrincipal = document.querySelector('.btn-contenu-principal')

// function apparitionAuScroll () {
//   if (window.scrollY > 100) {
//     btnRetourContenuPrincipal.setAttribute('aria-hidden', 'false')
//     // btnRetourContenuPrincipal.style.display = 'block'
//   } else {
//     btnRetourContenuPrincipal.setAttribute('aria-hidden', 'true')
//   }
// }
// window.addEventListener('scroll', apparitionAuScroll)
