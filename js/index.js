/**
-------------------------------------
PAGE INDEX
-------------------------------------
*/

// variables utiles
const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main

/**
----------------------------------------------------------
1 - récupération des donnée JSON au chargement de la page
----------------------------------------------------------
*/

// eslint-disable-next-line prefer-const
let apiUrl = 'js/data/fisheyedata.json'
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
  constructeurIndex(data)
}
document.addEventListener('DOMContentLoaded', chargementData)

/**
---------------------------------------
2 - Outils
---------------------------------------
*/

const templates = {

  // logo
  logoFisheEye: () => {
    return `
    <a href="index.html">
      <img class="logo" src="resources/img/logo.png" alt="FishEye : Page d'accueil">
    </a>`
  },

  // bouton tag individuel
  navigationTag: (tag) => {
    return ` <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
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

  // fiche complète d'un photographe
  fichePhotographe: (photographe) => {
    return `<li class="photographe-profil">
      <a href="page-photographe.html?id=${photographe.id}">
        <img class="vignette" src="resources/img/photographers/IDphotos/${photographe.portrait}" alt="portrait de ${photographe.name}"/>
        <h2 class="nom">${photographe.name}</h2>
      </a>
      <div tabindex="0">
        <p class="localisation">${photographe.city}, ${photographe.country}</p>
        <p class="accroche">${photographe.tagline}</p>
        <span class="tarif">${photographe.price}€</span><span class="tarif">/jour</span>
      </div>
      ${templates.listeTagsParPhotographe(photographe.tags)}
      </li>`
  }
}

const utilitaires = {
  definirAttributs: (element, attributs) => {
    // eslint-disable-next-line prefer-const
    for (let cle in attributs) {
      element.setAttribute(cle, attributs[cle])
    }
  },
  // apparait au scroll et retour vers le haut au clic
  // (!!!) Ajouter gestion au clavier
  apparitionAuScroll: function (valeurY, element) {
    window.addEventListener('scroll', () => {
      window.scrollY > valeurY ? element.removeAttribute('aria-hidden') : element.setAttribute('aria-hidden', 'true')
    })
    element.addEventListener('click', () => {
      window.scrollTop = 0
    })
  },

  // trier les tags et supprimer les doublons
  trierTableauTags: (data) => {
    // eslint-disable-next-line prefer-const
    let tableauTags = []
    data.photographers.map(tag => tag.tags.map(tag => tableauTags.push(tag)))
    const tagUnique = new Set(tableauTags)
    const listeTags = [...tagUnique]
    return listeTags
  },

  affichageParTagActif: (tags, tagActif) => {
    const fichesPhotographes = document.querySelectorAll('.photographe-profil')
    const tagsRetenus = []

    tags.forEach((tag) => {
      if (tag.textContent.toLowerCase() === tagActif.textContent.toLowerCase()) {
        // Pour chaque tag, vérifier que le tag actuel et le tag cliqué correspondent
      // si oui, modifier statut de la classe active
        tag.classList.toggle('active')
      } else {
      // sinon, retirer la classe active
        tag.classList.remove('active')
      }
      // Récupérer tous les tags ayant matché par la classe active
      // et les envoyer dans le tableau des fiches retenues (fichesRetenues)
      if (tag.classList.contains('active')) {
        tagsRetenus.push(tag)
      }
    })

    // Faire disparaitre toutes les fiches quand un tag sélectionné
    // et afficher seulement le tableau fichesRetenues
    if (tagsRetenus.length !== 0) {
      fichesPhotographes.forEach((fichePhotographe) => fichePhotographe.classList.add('desactiver'))
      tagsRetenus.forEach((fiche) => {
        const ficheActive = fiche.closest('.photographe-profil')
        if (ficheActive !== null) {
        // si le parent '.photographe-profil' existe (= exclure tags du header)
          ficheActive.classList.remove('desactiver')
        }
      })
    } else {
    // si aucun tag sélectionné, afficher toutes les fiches
      fichesPhotographes.forEach((fichePhotographe) => fichePhotographe.classList.remove('desactiver'))
    }
  },

  // fonctionnalité : affichage par tag
  trierParTag: function () {
    const tags = document.querySelectorAll('.tag-entree')
    tags.forEach(function (tagActif) {
      tagActif.addEventListener('click', () => {
        utilitaires.affichageParTagActif(tags, tagActif)
      })
    })
  }
}

/**
----------------------------------------
3 - Initialisation des éléments du DOM
----------------------------------------
*/

const creationBtnRetourMain = () => {
  const btnRetour = document.createElement('a')
  btnRetour.classList.add('btn-contenu-principal')
  utilitaires.definirAttributs(btnRetour, { href: '#contenu-prinipal', 'aria-hidden': 'true', tabindex: '0' })
  btnRetour.innerText = 'Passer au contenu'
  corpsPage.prepend(btnRetour)

  utilitaires.apparitionAuScroll(200, btnRetour)
}

const creationHeader = (data) => {
  const header = document.createElement('header')
  header.classList.add('banniere')
  header.innerHTML = `
        ${templates.logoFisheEye()}
        <nav aria-label="trier les photographes par categories">
          <ul class="nav-par-tag" >
            ${utilitaires.trierTableauTags(data).map(templates.navigationTag).join('')}
          </ul>
        </nav>
        <h1 tabindex="0">Nos photographes</h1>
`
  corpsPage.prepend(header)
}

const creationGaleriePhotographes = (data) => {
  const photographesGalerie = document.createElement('ul')
  photographesGalerie.classList.add('photographes-galerie')
  corpsContenuPage.append(photographesGalerie)

  const dataFiche = data.photographers.map(templates.fichePhotographe).join('')
  photographesGalerie.innerHTML = dataFiche
}

/**
---------------------------------
4 - Fabrique de la page index
---------------------------------
*/

const constructeurIndex = (data) => {
  creationBtnRetourMain()
  creationHeader(data)
  creationGaleriePhotographes(data)

  utilitaires.trierParTag()
}
