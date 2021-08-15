/* eslint-disable eqeqeq */

// TODO :
// Pour créer les PAGES PHOTOGRAPHE :
// Récupérer les données json et les stocker
// Générer les composants de la bannière (dont formulaire)
// Générer la bannière
// Bouton trier par + fonctionnalité de tri
// Générer les composants de profil-galerie (afficher medias et composant lightbox)

// éléments du DOM
const corpsPage = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

const touchesClavier = {
  tab: 9,
  enter: 13,
  echap: 27
}

/**
---------------------------------------
1 - récupération des donnée JSON
---------------------------------------
*/

const apiUrl = 'js/data/fisheyedata.json'
const jsonData = async () => {
  try {
    const reponse = await fetch(apiUrl)
    const data = await reponse.json()
    return data
  } catch (erreur) {
    console.log('Erreur dans le chargement des données. ' + ('( ') + erreur + (' )'))
  }
}

/**
----------------------------------------------------
2 - récupération de l'ID du photographe en cours
----------------------------------------------------
*/

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const photographeID = urlParams.get('id')
console.log(`récupération de l'ID : ${photographeID}`)

// 2 - chargement des données JSON au chargement de la page
// stockées dans currentPhotographe et currentPhotographeMedias

const chargementData = async () => {
  const data = await jsonData()
  const photographes = data.photographers
  const mediasPhotographe = data.media

  // récupération du photographe en cours
  const currentPhotographe = photographes.find((photographe) => photographe.id == photographeID)
  // console.log(currentPhotographe)

  // récupération des médias associés au photographe
  const currentPhotographeMedias = mediasPhotographe.filter((media) => media.photographerId == photographeID)
  // console.log(currentPhotographeMedias)

  constructeurPagePhotographe(currentPhotographe, currentPhotographeMedias)
}
// appel de la fonction de chargement des données au chargement de la page
document.addEventListener('DOMContentLoaded', chargementData)

/**
----------------------------------------------------
3 - Composants de la page
----------------------------------------------------
*/

const templateHeader = (data) => {
  const header = document.createElement('header')
  header.classList.add('banniere')
  header.innerHTML = `
        <a href="index.html">
            <img class="logo" src="resources/img/logo.png" alt="FishEye : page d'accueil">
        </a>
`
  corpsPage.prepend(header)
}

const tagsParPhotographe = (tags) => {
  return `
  <ul class="nav-par-tag" >
  ${tags.map((tag) =>
   `<li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
  ).join('')}
  </ul>`
}

const templateBannierePhotographe = (photographe) => {
  return `
  <div class="photographe-profil">
          <h1 class="nom" tabindex="0">${photographe.name}</h1>
          <div tabindex="0">
              <p class="localisation">${photographe.city}, ${photographe.country}</p>
              <p class="accroche">${photographe.tagline}</p>
          </div>
          

          ${tagsParPhotographe(photographe.tags)}

          <!-- bouton de contact -->
          <button type="button"
          aria-haspopup="dialog" aria-controls="dialog"
          id="btn-modale" class="btn-formulaire btn-principal">
              Contactez-moi
          </button>

  </div>
      <img class="vignette" src="resources/img/photographers/IDphotos/${photographe.portrait}" alt="" tabindex="0"/>
`
}

const bannierePhotographe = (currentPhotographe) => {
  // création du conteneur
  const conteneurBanniere = document.createElement('div')
  conteneurBanniere.classList.add('banniere-photographe')
  corpsContenuPage.append(conteneurBanniere)
  // appel du template
  conteneurBanniere.innerHTML = templateBannierePhotographe(currentPhotographe)
  // ajout du composant au conteneur
}

const blocFixe = (photographe) => {
  const conteneurBlocFixe = document.createElement('div')
  conteneurBlocFixe.classList.add('bloc-fixe')
  corpsContenuPage.appendChild(conteneurBlocFixe)
  conteneurBlocFixe.innerHTML = `
  <div class="bloc-fixe" tabindex="0">
    <p class="compteur-likes">297 081 <span class="icone-like" aria-label="j'aime"><i class="fas fa-heart"></i></span></p>
    <span class="tarif">${photographe.price}€ /jour</span>
  </div>
  `
}

const sectionTrierPar = (photographe, figure) => {
  // création du conteneur div
  const conteneurSection = document.createElement('div')
  conteneurSection.classList.add('trier-par')
  corpsContenuPage.appendChild(conteneurSection)

  // ajout de chaque fiche au conteneur
  conteneurSection.innerHTML = `<p tabindex="0">Trier par</p>
  <div class="select" tabindex="0">
      <button></button>
      <div class="options">
          <input id="popularite" name="select" type="radio" value="popularite"
          aria-checked="ok" checked>
          <label for="popularite" style="--index: 1">Popularité</label>
          <input id="date" name="select" type="radio" value="date">
          <label for="date" style="--index: 2">Date</label>
          <input id="titre" name="select" type="radio" value="titre">
          <label for="titre" style="--index: 3">Titre</label>
  
          <svg viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
          </svg>
      </div>
  </div>`
}

const templateItemGalerie = (figure) => {
  // si image :
  if (figure.image !== undefined) {
    return `
  <figure class="apercu-photo">
                    <a href="#">
                        <img src="resources/img/photographers/${figure.photographerId}/${figure.image}" alt="${figure.description}">
                    </a>
                    <figcaption>
                        <p class="photo-titre" tabindex="0">${figure.title}</p>
                        <div class="likes">
                            <p class="likes__nombre" tabindex="0">${figure.likes}</p>
                            <button class="icone-like" aria-label="j'aime">
                                <i class="fas fa-heart" tabindex="-1"></i>
                            </button> 
                        </div>
                    </figcaption>
                </figure>
`
  // si vidéo :
  } else {
    return `
  <figure class="apercu-photo">
                    <a href="#">
                        <video>
                            <source src="resources/video/photographers/${figure.photographerId}/${figure.video}" alt="${figure.description}">
                            <video alt="Chevaux dans la montagne" autoplay="" controls="" loop=""
                        </video>
                    </a>
                    <figcaption>
                        <p class="photo-titre" tabindex="0">Wild horses in the mountains</p>
                        <div class="likes" tabindex="0">
                            <p class="likes__nombre">${figure.likes}</p>
                            <span class="icone-like" aria-label="j'aime">
                                <i class="fas fa-heart" ></i>
                            </span> 
                        </div>
                    </figcaption>
                </figure>
`
  }
}

const photographeGalerie = (photographe, figure) => {
  // création du conteneur div
  const conteneurGalerie = document.createElement('div')
  conteneurGalerie.classList.add('profil-galerie')
  corpsContenuPage.appendChild(conteneurGalerie)

  // appel du template de la fiche pour chaque photographe
  const dataFiche = figure.map(templateItemGalerie).join('')

  // ajout de chaque fiche au conteneur
  conteneurGalerie.innerHTML = dataFiche
}

/**
----------------------------------------------------
3.1 - Formulaire et fonctionnalités
----------------------------------------------------
*/
// formulaire

const formulaireTemplate = (photographe) => {
  // création du conteneur div
  const sectionFormulaire = document.createElement('section')
  sectionFormulaire.classList.add('modale-formulaire')
  sectionFormulaire.setAttribute('id', 'dialog')
  sectionFormulaire.setAttribute('role', 'dialog')
  sectionFormulaire.setAttribute('aria-labelledby', 'titre-formulaire')
  sectionFormulaire.setAttribute('aria-modal', 'true')
  sectionFormulaire.setAttribute('aria-hidden', 'true')


  corpsContenuPage.appendChild(sectionFormulaire)
  
  // ajout de chaque fiche au conteneur
  sectionFormulaire.innerHTML = `
          <!-- <h2 class="hidden">Formulaire de contact</h2> -->

            <div role="document" class="formulaire-contenu">

                <button type="button" aria-label="Fermer la fenêtre de dialogue"
                data-dismiss="dialog"
                class="btn-fermeture">
                </button>

                <!-- titre perso du formulaire -->
                <div id="titre-formulaire">
                    <h1>Contactez moi
                    <br>${photographe.name}</h1>
                </div>
                

                <form action="/" method="GET" class="formulaire" name="formulaire-contact">

                    <div class="champ-formulaire">
                        <label for="prenom">Prénom</label>
                        <input
                        class="text-control"
                        type="text"
                        id="prenom"
                        name="prenom"
                        title="Renseignez votre prénom."
                        aria-required="true"
                        autofocus
                        />
                    </div>

                    <div class="champ-formulaire">
                        <label for="nom">Nom</label>
                        <input
                        class="text-control"
                        type="text"
                        id="nom"
                        name="nom"
                        title="Renseignez votre nom."
                        aria-required="true"
                        />
                    </div>

                    <div class="champ-formulaire">
                        <label for="email">Email</label>
                        <input
                        class="text-control"
                        type="email"
                        id="email"
                        name="email"
                        title="Renseignez votre email."
                        aria-required="true"
                        />
                    </div>

                    <div class="champ-formulaire">
                        <label for="message">Message</label>
                        <textarea
                        class="text-control"
                        id="message"
                        name="message"
                        title="Rédigez ici votre message adressé au photographe."
                        aria-required="true">
                        </textarea>
                        

                    </div>

                    <!-- bouton d'envoi -->
                    <input
                      id="btn-envoi"
                      type="submit"
                      class="btn-principal"
                      value="Envoyer"
                      aria-label="Envoyer"
                      aria-describedby="erreur-saisie"/>
                      
                      <!-- message d'erreur -->
                    <span id= "erreur-saisie" class="erreur-saisie"
                        role="alert" tabindex="0"></span>
                        

                </form>

            </div>`

  // éléments du DOM
  const corpsFormulaire = document.querySelector('.modale-formulaire')
  const contenuFormulaire = document.querySelector('.formulaire-contenu')
  const btnOuvrirFormulaire = document.querySelector('#btn-modale')
  console.log(btnOuvrirFormulaire)
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
    corpsPage.style.overflow = 'hidden'
    premierElementFocusable.focus()
  }
  btnOuvrirFormulaire.addEventListener('click', formulaireOuverture)

  /////////////////////////////////////
  // FERMETURE ACCESSIBLE FORMULAIRE //
  /////////////////////////////////////
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

}


/**
----------------------------------------------------
4 - Génération de la page
----------------------------------------------------
*/

const constructeurPagePhotographe = (currentPhotographe, currentPhotographeMedias) => {
  templateHeader()
  bannierePhotographe(currentPhotographe)
  blocFixe(currentPhotographe)
  sectionTrierPar()
  photographeGalerie(currentPhotographe, currentPhotographeMedias)
  formulaireTemplate(currentPhotographe)

  console.log('chargement général')
  console.log(currentPhotographeMedias)
}
