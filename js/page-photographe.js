// import { templates } from './index.js'

/* eslint-disable eqeqeq */

/**
-------------------------------------
PAGES PHOTOGRAPHES
-------------------------------------
*/

// variables utiles
const corpsPage = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

const touchesClavier = {
  tab: 9,
  enter: 13,
  echap: 27,
  gauche: 37,
  droite: 39,
  espace: 32
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

const chargementData = async () => {
  const data = await jsonData()
  const photographes = data.photographers
  const mediasPhotographe = data.media

  const photographeID = utilitaires.recupParametreUrl()
  const currentPhotographe = utilitaires.recupCurrentPhotographe(photographes, photographeID)
  const currentPhotographeMedias = utilitaires.recupCurrentPhotographeMedias(mediasPhotographe, photographeID)

  // appel du constructeur de la page avec récupération du photographe en cours et de ses médias
  constructeurPagePhotographe(currentPhotographe, currentPhotographeMedias)
}
document.addEventListener('DOMContentLoaded', chargementData)

/**
----------------------------------------------------
2 - Outils
----------------------------------------------------
*/

const utilitaires = {
  // test de squelette
  prependElementDOM: (balise, classe, template, conteneur) => {
    const element = document.createElement(balise)
    element.classList.add(classe)
    element.innerHTML = template
    conteneur.prepend(element)
  },

  appendElementDOM: (balise, classe, template, conteneur) => {
    const element = document.createElement(balise)
    element.classList.add(classe)
    element.innerHTML = template
    conteneur.append(element)
  },

  // récupérer dans l'URL l'id du photographe en cours
  recupParametreUrl: () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('id')
  },

  // récupérer le photographe encours (même numéro que l'url)
  recupCurrentPhotographe: (photographes, photographeID) => {
    return photographes.find((photographe) => photographe.id == photographeID)
  },

  // récupérer les médias associés au photographe en cours
  recupCurrentPhotographeMedias: (mediasPhotographe, photographeID) => {
    return mediasPhotographe.filter((media) => media.photographerId == photographeID)
  },

  recupCurrentPhotographeTotalLikes: (medias) => {
    let likesParImage = []
    medias.map(media => likesParImage.push(media.likes))
    return likesParImage
  },

  incrementerLikes: (like, event) => {
    let totalLikes = like.previousSibling.textContent.replace(/\s+/g, '')
    let affichageLikes = like.previousSibling

    const compteurGeneral = document.querySelector('.compteur-likes')
    let compteurGeneralLikes = compteurGeneral.textContent

    event.target.classList.toggle('like-actif')
    if (event.target.classList.contains('like-actif')) {
      totalLikes++
      affichageLikes.textContent = totalLikes
      compteurGeneralLikes++
      compteurGeneral.innerHTML = `<p class="compteur-likes">${compteurGeneralLikes} <span class="icone-like" aria-label="j'aime"><i class="fas fa-heart"></i></span></p>`
    } else {
      totalLikes--
      affichageLikes.textContent = totalLikes
      compteurGeneralLikes--
      compteurGeneral.innerHTML = `<p class="compteur-likes">${compteurGeneralLikes} <span class="icone-like" aria-label="j'aime"><i class="fas fa-heart"></i></span></p>`
    }
  },

  fonctionLike: () => {
    const likes = document.querySelectorAll('.icone-like')
    likes.forEach(like => {
      like.addEventListener('click', (event) => {
        utilitaires.incrementerLikes(like, event)
      })
    })
  },

  trierParPopularite: (medias) => {
    medias.sort((a, b) => {
      return b.likes - a.likes
    })
  },

  trierParDate: (medias) => {
    medias.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB - dateA
    })
  },

  trierParTitre: (medias) => {
    medias.sort((a, b) => {
      const titreA = a.title.toLowerCase()
      const titreB = b.title.toLowerCase()
      if (titreA < titreB) {
        return -1
      } if (titreA > titreB) {
        return 1
      } else {
        return 0
      }
    })
  },

  actualisationAffichage: (medias) => {
    const itemsGalerie = document.querySelectorAll('.apercu-photo')
    const conteneurGalerie = document.querySelector('.profil-galerie')
    // supprimer les apercus sans tri
    itemsGalerie.forEach((item) => item.classList.add('desactiver'))
    // appel du template de la fiche pour chaque photographe
    const dataFiche = medias.map(templates.itemGalerie).join('')
    // ajout de chaque fiche au conteneur
    conteneurGalerie.innerHTML = dataFiche

    utilitaires.fonctionLike()
    Lightbox.init(medias)
  },

  trierMediasPar: (medias) => {
    const selected = document.querySelector('.selected')
    if (selected.textContent === 'Popularité') {
      utilitaires.trierParPopularite(medias)
    } else if (selected.textContent === 'Date') {
      utilitaires.trierParDate(medias)
    } else if (selected.textContent === 'Titre') {
      utilitaires.trierParTitre(medias)
    }
    utilitaires.actualisationAffichage(medias)
  }
}

const templates = {
  // logo
  logoFisheEye: () => {
    return `
    <a href="index.html">
      <img class="logo" src="resources/img/logo.png" alt="FishEye : Page d'accueil">
    </a>`
  },

  // liste des tags par photographe
  listeTagsParPhotographe: (tags) => {
    return `
      <ul class="nav-par-tag" >
      ${tags.map((tag) =>
       `<li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
      ).join('')}
      </ul>`
  },

  contenuBannierePhotographe: (photographe) => {
    return `
    <div class="photographe-profil">
      <h1 class="nom" tabindex="0">${photographe.name}</h1>
        <div tabindex="0">
          <p class="localisation">${photographe.city}, ${photographe.country}</p>
          <p class="accroche">${photographe.tagline}</p>
        </div>
        ${templates.listeTagsParPhotographe(photographe.tags)}
        <button type="button" aria-haspopup="dialog" aria-controls="dialog" id="btn-modale" class="btn-formulaire btn-principal">
          Contactez-moi
        </button>
    </div>
    <img class="vignette" src="resources/img/photographers/IDphotos/${photographe.portrait}" alt="" tabindex="0"/>`
  },

  compteurBlocFixe: (totalLikesGalerie, photographe) => {
    return `
      <p class="compteur-likes">${totalLikesGalerie} <span class="icone-like" aria-label="j'aime"><i class="fas fa-heart"></i></span></p>
      <span class="tarif">${photographe.price}€ /jour</span>
    `
  },

  btnTrierPar: () => {
    return `<div class="trier-par">
    <p tabindex="0" id="label-trier-par">Trier par</p>
  
    <div class="select" tabindex="0">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
        </svg>
  
        <button class="selected" aria-labelledby="label-trier-par" aria-haspopup="listbox"
        aria-label="criteres" aria-expanded="false">
            Popularité
        </button>
  
        <ul class="conteneur-options" role="listbox" aria-labelledby="label-trier-par"
            aria-label="criteres">
  
            <li class="option" role="option">
                <input class="radio" id="option-popularite" name="select" type="radio" value="popularite"
                aria-checked="ok" />
                <label for="popularite">Popularité</label>
            </li>
            <li class="option" role="option">
                <input class="radio" id="option-date" name="select" type="radio" value="date" />
                <label for="date">Date</label>
            </li>
            <li class="option" role="option">
                <input class="radio" id="option-titre" name="select" type="radio" value="titre" />
                <label for="titre">Titre</label>
            </li>
                
        </ul>
  
            
        </div>
        
    </div>
  </div>`
  },

  itemGalerie: (figure) => {
    // si image :
    if (figure.image !== undefined) {
      return `
    <figure class="apercu-photo">
      <a href="resources/img/photographers/${figure.photographerId}/${figure.image}" id="${figure.id}">
        <img src="resources/img/photographers/${figure.photographerId}/${figure.image}" alt="${figure.description}">
      </a>
      <figcaption>
        <p class="photo-titre" tabindex="0">${figure.title}</p>
        <div class="likes">
          <p class="likes__nombre" tabindex="0">${figure.likes}</p><button class="icone-like" aria-label="j'aime"><i class="fas fa-heart" tabindex="-1"></i></button> 
        </div>
      </figcaption>
    </figure>`
    // si vidéo :
    } else {
      return `
    <figure class="apercu-photo">
      <a href="resources/video/photographers/${figure.photographerId}/${figure.video}" id="${figure.id}">
        <video alt="${figure.description}" autoplay="" controls="" loop="" <="" video="">
          <source src="resources/video/photographers/${figure.photographerId}/${figure.video}" alt="${figure.description}" type="video/mp4">
        </video>
      </a>
      <figcaption>
        <p class="photo-titre" tabindex="0">${figure.title}</p>
        <div class="likes" tabindex="0">
          <p class="likes__nombre">${figure.likes}</p><button class="icone-like" aria-label="j'aime"><i class="fas fa-heart" ></i></button> 
        </div>
      </figcaption>
    </figure>`
    }
  }

}

/**
----------------------------------------------------
3 - Initialisation des éléments du DOM
----------------------------------------------------
*/

const creationHeader = (data) => {
  utilitaires.prependElementDOM(
    'header',
    'banniere',
    templates.logoFisheEye(),
    corpsPage)
}

const creationBannierePhotographe = (currentPhotographe) => {
  utilitaires.appendElementDOM(
    'div',
    'banniere-photographe',
    templates.contenuBannierePhotographe(currentPhotographe),
    corpsContenuPage
  )
}

const creationBlocFixe = (photographe, medias) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  // additionner les valeurs pour obtenir le total des likes
  const totalLikesGalerie = utilitaires.recupCurrentPhotographeTotalLikes(medias).reduce(reducer)

  utilitaires.appendElementDOM(
    'div',
    'bloc-fixe',
    templates.compteurBlocFixe(totalLikesGalerie, photographe),
    corpsContenuPage)

  document.querySelector('.bloc-fixe').setAttribute('tabindex', '0')
}

const creationGaleriePhotographe = (photographe, medias) => {
  const apercuFigure = medias.sort((a, b) => b.likes - a.likes)
    .map(templates.itemGalerie).join('')

  utilitaires.appendElementDOM(
    'div',
    'profil-galerie',
    apercuFigure,
    corpsContenuPage
  )

  utilitaires.fonctionLike()
  Lightbox.init(medias)
}

const creationBoutonTrierPar = (photographe, medias) => {
  utilitaires.appendElementDOM(
    'div',
    'trier-par',
    templates.btnTrierPar(),
    corpsContenuPage
  )

  const selected = document.querySelector('.selected')
  const conteneurOptions = document.querySelector('.conteneur-options')
  const optionsListe = document.querySelectorAll('.option')
  const btnFleche = document.querySelector('.select svg')

  // par défaut : popularité
  selected.innerHTML = optionsListe[0].querySelector('label').innerHTML

  // afficher les options
  selected.addEventListener('click', (e) => {
    selected.innerHTML = ''
    conteneurOptions.classList.toggle('active')
    btnFleche.classList.toggle('extend')
    selected.toggleAttribute('aria-expanded', 'true')
    selected.classList.toggle('selected-active')
  })

  // selection d'une option (NE PAS OUBLIER ACCESSIBILITE)
  optionsListe.forEach(o => {
    o.addEventListener('click', () => {
      selected.innerHTML = o.querySelector('label').innerHTML
      conteneurOptions.classList.remove('active')
      selected.classList.remove('selected-active')
      btnFleche.classList.remove('extend')
      // o.removeAttribute('aria-checked')
      conteneurOptions.setAttribute('aria-activedescendant', o.innerText)
      utilitaires.trierMediasPar(medias)
    })
  })
}

/**
----------------------------------------------------
4 - Formulaire et fonctionnalités
----------------------------------------------------
*/

const formulaireTemplate = (photographe) => {
  // création du conteneur div
  const sectionFormulaire = document.createElement('section')
  sectionFormulaire.classList.add('modale-formulaire')
  sectionFormulaire.setAttribute('id', 'dialog')
  sectionFormulaire.setAttribute('role', 'dialog')
  sectionFormulaire.setAttribute('aria-labelledby', 'titre-formulaire')
  sectionFormulaire.setAttribute('aria-modal', 'true')
  sectionFormulaire.setAttribute('aria-hidden', 'true')

  corpsPage.appendChild(sectionFormulaire)

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

  /// //////////////////////////////////
  // FERMETURE ACCESSIBLE FORMULAIRE //
  /// //////////////////////////////////

  function formulaireFermeture () {
    corpsFormulaire.setAttribute('aria-hidden', 'true')
    corpsContenuPage.setAttribute('aria-hidden', 'false')
    corpsPage.style.overflow = 'scroll'
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
          } if (e.touchesClavier) {
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
5 - Lightbox et fonctionnalités
----------------------------------------------------
*/

// const templateItemCarroussel = (photographe, media) => {
//   if (media.image !== undefined) {
//     return `
//   <li class="lightbox-element">
//     <figure>
//       <img src="resources/img/photographers/${photographe.id}/${media.image}" alt="${media.description}">
//       <figcaption class="photo-titre">${media.title}</figcaption>
//     </figure>
//  </li>
// `
//   } else {
//     return `
//   <li class="lightbox-element">
//     <figure>
//       <video src="resources/video/photographers/${photographe.id}/${media.video}" alt="${media.description}">
//       <figcaption class="photo-titre">${media.title}</figcaption>
//     </figure>
//   </li>
//   `
//   }
// }

// const templateLightbox = (photographe, medias) => {
//   // création du conteneur div
//   const conteneurLightbox = document.createElement('section')
//   conteneurLightbox.classList.add('lightbox')
//   conteneurLightbox.setAttribute('role', 'dialog')
//   conteneurLightbox.setAttribute('aria-label', 'image pein écran')
//   conteneurLightbox.setAttribute('aria-modal', 'true')
//   conteneurLightbox.setAttribute('aria-hidden', 'true')
//   corpsPage.appendChild(conteneurLightbox)

//   conteneurLightbox.innerHTML = `
//                     <!-- composants lightbox -->
//                     <div class="lightbox__commandes">
//                       <button class="gauche" aria-label="image précédente"><i class="fas fa-chevron-left"></i> </button>
//                       <button class="droite" aria-label="image suivante"><i class="fas fa-chevron-right"></i></button>
//                       <button class="btn-fermeture" aria-label="fermer la lightbox"></button>
//                     </div>
//                     <ul class="lightbox__contenu">
//                       ${medias.map((media) => templateItemCarroussel(photographe, media)).join('')}
//                     </ul>
//   `
// //   <li class="lightbox-element actif">
// }

// const affichageLightbox = (vignette, vignettesImages) => {
//   const corpsLightbox = document.querySelector('.lightbox')

//   corpsContenuPage.setAttribute('aria-hidden', 'true')
//   corpsPage.style.overflow = 'hidden'
//   corpsLightbox.setAttribute('aria-hidden', 'false')
// }

// const fermetureLightbox = () => {
//   const corpsLightbox = document.querySelector('.lightbox')

//   corpsContenuPage.setAttribute('aria-hidden', 'false')
//   corpsPage.style.overflow = 'scroll'
//   corpsLightbox.setAttribute('aria-hidden', 'true')
// }

class Lightbox {
  static init (medias) {
    const vignettes = Array.from(document.querySelectorAll('.apercu-photo a'))
    vignettes.forEach(vignette => vignette.addEventListener('click', (e) => {
      e.preventDefault()
      const idVignetteEnCours = e.currentTarget.getAttribute('id')
      const mediaEnCours = medias.find(media => media.id == idVignetteEnCours)
      new Lightbox(mediaEnCours, medias)
    })
    )
  }

  constructor (mediaEnCours, medias) {
    this.element = this.creerLightbox(mediaEnCours, medias)
    this.medias = medias
    this.affichageLightbox()
    this.chargerMedia(mediaEnCours)
    this.gestionClavier = this.gestionClavier.bind(this)
    corpsPage.appendChild(this.element)
    document.addEventListener('keyup', this.gestionClavier)
  }

  creerLightbox (mediaEnCours, medias) {
    const conteneurLightbox = document.createElement('section')
    conteneurLightbox.classList.add('lightbox')
    conteneurLightbox.setAttribute('role', 'dialog')
    conteneurLightbox.setAttribute('aria-label', 'image pein écran')
    conteneurLightbox.setAttribute('aria-modal', 'true')
    conteneurLightbox.setAttribute('aria-hidden', 'true')
    conteneurLightbox.innerHTML = `
                    <!-- composants lightbox -->
                    <div class="lightbox__commandes">
                      <button class="gauche" aria-label="image précédente"><i class="fas fa-chevron-left"></i> </button>
                      <button class="droite" aria-label="image suivante"><i class="fas fa-chevron-right"></i></button>
                      <button class="btn-fermeture" aria-label="fermer la lightbox"></button>
                    </div>
                    <ul class="lightbox__contenu">
                    </ul>
  `
    conteneurLightbox.querySelector('.btn-fermeture').addEventListener('click', this.fermetureLightbox.bind(this))
    conteneurLightbox.querySelector('.droite').addEventListener('click', this.suivante.bind(this, mediaEnCours))
    conteneurLightbox.querySelector('.gauche').addEventListener('click', this.precedente.bind(this, mediaEnCours))
    return conteneurLightbox
  }

  affichageLightbox (e) {
    corpsContenuPage.setAttribute('aria-hidden', 'true')
    corpsPage.style.overflow = 'hidden'
    this.element.setAttribute('aria-hidden', 'false')
    document.addEventListener('keyup', this.gestionClavier)
  }

  fermetureLightbox (e) {
    e.preventDefault()
    corpsContenuPage.setAttribute('aria-hidden', 'false')
    corpsPage.style.overflow = 'scroll'
    // this.element.setAttribute('aria-hidden', 'true')
    this.element.remove()
    document.removeEventListener('keydown', this.gestionClavier)
  }

  gestionClavier (e) {
    if (e.key === touchesClavier.echap) {
      this.close(e)
    } else if (e.key === touchesClavier.gauche) {
      this.precedente(e)
    } else if (e.key === touchesClavier.droite) {
      this.suivante(e)
    }
  }

  chargerMedia (mediaEnCours) {
    const conteneurLightbox = this.element.querySelector('.lightbox__contenu')
    if (mediaEnCours.image !== undefined) {
      utilitaires.appendElementDOM(
        'li',
        'lightbox-element',
        `<figure>
        <img src="resources/img/photographers/${mediaEnCours.photographerId}/${mediaEnCours.image}" alt="${mediaEnCours.description}">
        <figcaption class="photo-titre">${mediaEnCours.title}</figcaption>
      </figure>`,
        conteneurLightbox)
    } else {
      utilitaires.appendElementDOM(
        'li',
        'lightbox-element',
        `<figure>
          <video src="resources/video/photographers/${mediaEnCours.photographerId}/${mediaEnCours.video}" alt="${mediaEnCours.description}">
          <figcaption class="photo-titre">${mediaEnCours.title}</figcaption>
        </figure>`,
        conteneurLightbox)
    }
  }

  suivante (mediaEnCours) {
    console.log(this.medias)
    let indexMediaEnCours = this.medias.indexOf(mediaEnCours)
    console.log(indexMediaEnCours)
    if (indexMediaEnCours === this.medias.length - 1) {
      indexMediaEnCours = 0
    }
    const mediaSuivant = this.medias[indexMediaEnCours + 1]
    console.log(mediaSuivant)
    this.chargerMedia(mediaSuivant)
  }

  precedente (mediaEnCours) {
    let indexMediaEnCours = this.medias.indexOf(mediaEnCours)
    if (indexMediaEnCours == 0) {
      indexMediaEnCours = this.medias.length
    }
    const mediaPrecedent = this.medias[indexMediaEnCours - 1]
    this.chargerMedia(mediaPrecedent)
  }
}

/**
----------------------------------------------------
6 - Génération de la page
----------------------------------------------------
*/

const constructeurPagePhotographe = (currentPhotographe, currentPhotographeMedias) => {
  creationHeader()
  creationBannierePhotographe(currentPhotographe)
  creationBlocFixe(currentPhotographe, currentPhotographeMedias)
  creationBoutonTrierPar(currentPhotographe, currentPhotographeMedias)
  creationGaleriePhotographe(currentPhotographe, currentPhotographeMedias)

  // modale formulaire
  formulaireTemplate(currentPhotographe)
}