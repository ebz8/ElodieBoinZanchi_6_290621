/* eslint-disable no-new */
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
  definirAttributs: (element, attributs) => {
    for (let cle in attributs) {
      element.setAttribute(cle, attributs[cle])
    }
  },

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
    const affichageLikes = like.previousSibling
    const compteurGeneral = document.querySelector('.compteur-likes')
    const iconeLike = event.currentTarget.querySelector('i')
    let compteurGeneralLikes = compteurGeneral.textContent

    iconeLike.classList.toggle('like-actif')
    if (iconeLike.classList.contains('like-actif')) {
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
  },

  gestionFocusModale: (modale) => {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstFocusableElement = modale.querySelectorAll(focusableElements)[0]
    const focusableContent = modale.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableContent[focusableContent.length - 1]

    firstFocusableElement.focus()

    document.addEventListener('keydown', (e) => {
      const isTabPressed = e.key === 'Tab'

      if (!isTabPressed) { return }
      if (e.shiftKey) { // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus() // add focus for the last focusable element
          e.preventDefault()
        }
      } else { // if tab key is pressed
        if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus() // add focus for the first focusable element
          e.preventDefault()
        }
      }
    })
    firstFocusableElement.focus()
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
        <button type="button" id="btn-modale" class="btn-formulaire btn-principal">
          Contactez-moi
        </button>
    </div>
    <img class="vignette" src="resources/img/photographers/IDphotos/${photographe.portrait}" alt="portrait de ${photographe.name}" tabindex="0"/>`
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
        aria-label="criteres" aria-expanded="false" aria-haspopup="true" aria-controls="listbox-liste">
            Popularité
        </button>
  
        <ul id="listbox-liste" class="conteneur-options" role="listbox" aria-labelledby="trier par"
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
    <figure class="apercu-photo" role="group" aria-label="${figure.title}">
      <a href="resources/img/photographers/${figure.photographerId}/${figure.image}" id="${figure.id}" tabindex="0">
        <img src="resources/img/photographers/${figure.photographerId}/${figure.image}" alt="${figure.description}">
      </a>
      <figcaption>
        <p class="photo-titre" >${figure.title}</p>
        <div class="likes">
          <p class="likes__nombre" tabindex="0">${figure.likes}</p><button class="icone-like" aria-label="j'aime" tabindex="0"><i class="fas fa-heart"></i></button> 
        </div>
      </figcaption>
    </figure>`
    // si vidéo :
    } else {
      return `
    <figure class="apercu-photo" role="group" aria-label="${figure.title}">
      <a href="resources/video/photographers/${figure.photographerId}/${figure.video}" id="${figure.id}" tabindex="0">
        <video alt="${figure.description}">
          <source src="resources/video/photographers/${figure.photographerId}/${figure.video}#t=0.1" alt="${figure.description}" type="video/mp4">
        </video>
      </a>
      <figcaption>
        <p class="photo-titre" tabindex="0">${figure.title}</p>
        <div class="likes">
          <p class="likes__nombre" tabindex="0">${figure.likes}</p><button class="icone-like" aria-label="j'aime" tabindex="0"><i class="fas fa-heart"></i></button> 
        </div>
      </figcaption>
    </figure>`
    }
  },

  champsFormulaire: (name, label, type, titre) => {
    return `
    <div class="champ-formulaire">
      <label for="${name}">${label}</label>
      <${type} class="text-control" id="${name}" name="${name}" title="${titre}" aria-required="true"></${type}>
    </div>`
  },

  sectionFormulaire: (photographe) => {
    return `
        <div role="document" class="formulaire-contenu">
            <button type="button" aria-label="Fermer la fenêtre de dialogue"
            data-dismiss="dialog" class="btn-fermeture">
            </button>

            <!-- titre perso du formulaire -->
            <div id="titre-formulaire">
                <h1>Contactez moi
                <br>${photographe.name}</h1>
            </div>

            <form action="/" method="GET" class="formulaire" name="formulaire-contact">
              ${templates.champsFormulaire(
                'prenom', 'Prénom',
                'input',
                'Renseignez votre prénom.')}

              ${templates.champsFormulaire(
                'nom', 'Nom',
                'input',
                'Renseignez votre nom.')}  

              ${templates.champsFormulaire(
                'email', 'Email',
                'input',
                'Renseignez votre email.')}
              
              ${templates.champsFormulaire(
                'message', 'Message',
                'textarea',
                'Rédigez ici votre message adressé au photographe.')}

                <!-- bouton d'envoi -->
                <input id="btn-envoi" type="submit" class="btn-principal" value="Envoyer" aria-label="Envoyer" aria-describedby="erreur-saisie"/>
                  
                <!-- message d'erreur -->
                <span id= "erreur-saisie" class="erreur-saisie" role="alert" tabindex="0"></span>
            </form>
        </div>
    `
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
  Formulaire.init(currentPhotographe)
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
    // conteneurOptions.setAttribute('tabindex', '-1')
  })

  // selection d'une option (NE PAS OUBLIER ACCESSIBILITE)
  optionsListe.forEach(o => {
    o.addEventListener('click', () => {
      selected.innerHTML = o.querySelector('label').innerHTML
      selected.classList.remove('selected-active')
      btnFleche.classList.remove('extend')
      // o.removeAttribute('aria-checked')
      conteneurOptions.classList.remove('active')
      conteneurOptions.setAttribute('aria-activedescendant', o.innerText)
      // conteneurOptions.setAttribute('tabindex', '0')
      utilitaires.trierMediasPar(medias)
    })
  })
}

/**
----------------------------------------------------
4 - Formulaire et fonctionnalités
----------------------------------------------------
*/

class Formulaire {
  static init (photographe) {
    new Formulaire(photographe)
  }

  constructor (photographe) {
    this.formulaire = this.creerFormulaire(photographe)
    this.gestionSaisie = this.gestionSaisie.bind(this)
    this.gestionClavier = this.gestionClavier.bind(this)
    document.addEventListener('keyup', this.gestionClavier)
    corpsPage.appendChild(this.formulaire)
  }

  creerFormulaire (photographe) {
    console.log('création formulaire')
    const sectionFormulaire = document.createElement('section')
    sectionFormulaire.classList.add('modale-formulaire')
    utilitaires.definirAttributs(sectionFormulaire, { id: 'dialog', role: 'dialog', 'aria-labelledby': 'titre-formulaire', 'aria-modal': 'true', 'aria-hidden': 'true', tabindex: '-1' })
    sectionFormulaire.innerHTML = templates.sectionFormulaire(photographe)

    // affichage du formulaire
    document.querySelector('#btn-modale').addEventListener('click', this.affichageFormulaire.bind(this))
    // dissimulation du formulaire
    sectionFormulaire.querySelector('.modale-formulaire .btn-fermeture').addEventListener('click', this.fermetureFormulaire.bind(this))
    // gestion au clavier du formulaire
    // contrôle de la saisie des champs du formulaire
    sectionFormulaire.querySelector('#btn-envoi').addEventListener('click', this.gestionSaisie.bind(this))
    return sectionFormulaire
  }

  affichageFormulaire () {
    corpsContenuPage.setAttribute('aria-hidden', 'true')
    corpsPage.style.overflow = 'hidden'
    this.formulaire.setAttribute('aria-hidden', 'false')
    utilitaires.gestionFocusModale(this.formulaire)
  }

  fermetureFormulaire () {
    corpsContenuPage.setAttribute('aria-hidden', 'false')
    corpsPage.style.overflow = 'scroll'
    this.formulaire.setAttribute('aria-hidden', 'true')
    document.querySelector('#btn-modale').focus()
  }

  gestionClavier (e) {
    console.log('gestion clavier')
    if (e.key === 'Escape' || e.code === 'Escape') {
      this.fermetureFormulaire(e)
    }
  }

  gestionSaisie (e) {
    e.preventDefault()

    const formChamps = document.forms['formulaire-contact']
    const messageErreur = document.querySelector('.erreur-saisie')
    // expressions régulières
    const regexNom = /^(?=[a-zA-ZéèîïÉÎÏ\s]{2,25}$)(?=[a-zA-Z\s])(?:([\w\s*?])\1?(?!\1))+$/
    const regexMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

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
      this.fermetureFormulaire()
    }
  }
}

/**
----------------------------------------------------
5 - Lightbox et fonctionnalités
----------------------------------------------------
*/
class Lightbox {
  static init (medias) {
    const vignettes = Array.from(document.querySelectorAll('.apercu-photo a'))
    vignettes.forEach(vignette => vignette.addEventListener('click', (e) => {
      e.preventDefault()
      const idVignetteEnCours = e.currentTarget.getAttribute('id')
      const mediaEnCours = medias.find(media => media.id == idVignetteEnCours)
      // eslint-disable-next-line no-new
      new Lightbox(mediaEnCours, medias)
    })
    )
  }

  constructor (mediaEnCours, medias) {
    this.lightbox = this.creerLightbox(mediaEnCours)
    this.medias = medias
    this.mediaEnCours = mediaEnCours
    this.affichageLightbox()
    this.chargerMedia(mediaEnCours)
    this.gestionClavier = this.gestionClavier.bind(this)
    document.addEventListener('keyup', this.gestionClavier)
    corpsPage.appendChild(this.lightbox)
  }

  creerLightbox (mediaEnCours) {
    const conteneurLightbox = document.createElement('section')
    conteneurLightbox.classList.add('lightbox')
    utilitaires.definirAttributs(conteneurLightbox, { 'role': 'dialog', 'aria-label': 'image en plein écran', 'aria-hidden': 'true', 'aria-modal': 'true' })

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
    conteneurLightbox.querySelector('.droite').addEventListener('click', this.suivante.bind(this))
    conteneurLightbox.querySelector('.gauche').addEventListener('click', this.precedente.bind(this))
    return conteneurLightbox
  }

  affichageLightbox (e) {
    corpsContenuPage.setAttribute('aria-hidden', 'true')
    corpsPage.style.overflow = 'hidden'
    this.lightbox.setAttribute('aria-hidden', 'false')
    document.addEventListener('keyup', this.gestionClavier)
  }

  fermetureLightbox (e) {
    e.preventDefault()
    corpsContenuPage.setAttribute('aria-hidden', 'false')
    corpsPage.style.overflow = 'scroll'
    // this.lightbox.setAttribute('aria-hidden', 'true')
    this.lightbox.remove()
    document.removeEventListener('keydown', this.gestionClavier)
  }

  chargerMedia (mediaAffiche) {
    const conteneurLightbox = this.lightbox.querySelector('.lightbox__contenu')
    this.mediaEnCours = mediaAffiche
    if (this.mediaEnCours.image !== undefined) {
      conteneurLightbox.innerHTML =
    `<li>
        <figure role="group" aria-label="${this.mediaEnCours.title}">
          <img src="resources/img/photographers/${this.mediaEnCours.photographerId}/${this.mediaEnCours.image}" alt="${this.mediaEnCours.description}" loading="lazy" aria-label="${this.mediaEnCours.title}">
          <figcaption class="photo-titre">${this.mediaEnCours.title}</figcaption>
        </figure>
      </li>`
    } else {
      conteneurLightbox.innerHTML =
    `<li>
      <figure role="group" aria-label="${this.mediaEnCours.title}">
        <video alt="${this.mediaEnCours.description}" controls="controls" loop="" <="" video="" aria-label="${this.mediaEnCours.title}">
          <source src="resources/video/photographers/${this.mediaEnCours.photographerId}/${this.mediaEnCours.video}" alt="${this.mediaEnCours.description}" type="video/mp4" loading="lazy">
        </video>
        <figcaption class="photo-titre">${this.mediaEnCours.title}</figcaption>
      </figure>
    </li>`
    }
    // diriger le focus sur le média en cours
    const mediasFocusables = ['img', 'video']
    const tableauMediasFocusables = conteneurLightbox.querySelectorAll(mediasFocusables)
    tableauMediasFocusables[0].focus()
  }

  suivante (e) {
    e.preventDefault()
    // rechercher l'index du média en cours
    let indexMediaEnCours = this.medias.findIndex(media => media === this.mediaEnCours)
    // quand dernier média du tableau, retourner au premier
    if (indexMediaEnCours === this.medias.length - 1) {
      indexMediaEnCours = -1
    }
    // +1 à l'index du média cours
    const mediaSuivant = this.medias[indexMediaEnCours + 1]
    this.chargerMedia(mediaSuivant)
  }

  precedente (e) {
    e.preventDefault()
    // rechercher l'index du média en cours
    let indexMediaEnCours = this.medias.findIndex(media => media === this.mediaEnCours)
    // quand premier média du tableau, aller au dernier
    if (indexMediaEnCours === 0) {
      indexMediaEnCours = this.medias.length
    }
    // -1 à l'index du média cours
    const mediaPrecedent = this.medias[indexMediaEnCours - 1]
    this.chargerMedia(mediaPrecedent)
  }

  gestionClavier (e) {
    if (e.key === 'Escape' || e.code === 'Escape') {
      this.fermetureLightbox(e)
    } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
      this.precedente(e)
    } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
      this.suivante(e)
    }
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
}