/**
-------------------------------------
PAGE INDEX
-------------------------------------
*/

// variables utiles
const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main

const touchesClavier = {
  tab: 9,
  enter: 13,
  echap: 27
}

//
// 1 - récupération des données JSON au chargement de la page
//

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

//
// 2 - Boite à outils
//

const templates = {
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
        <img class="vignette" src="resources/img/photographers/IDphotos/${photographe.portrait}" alt=" "/>
        <h2 class="nom">${photographe.name}</h2>
      </a>
      <div tabindex="0">
        <p class="localisation">${photographe.city}, ${photographe.country}</p>
        <p class="accroche">${photographe.tagline}</p>
        <span class="tarif">${photographe.price}€</span><span class="tarif" aria-label="par jour">/jour</span>
      </div>
      ${templates.listeTagsParPhotographe(photographe.tags)}
      </li>`
  }
}

const utilitaires = {
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
      // Pour chaque tag, vérifier que le tag actuel et le tag cliqué correspondent
      if (tag.textContent.toLowerCase() === tagActif.textContent.toLowerCase()) {
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
    // console.log(fichesRetenues)
      fichesPhotographes.forEach((fichePhotographe) => fichePhotographe.classList.add('desactiver'))
      tagsRetenus.forEach((fiche) => {
        const ficheActive = fiche.closest('.photographe-profil')

        // si le parent '.photographe-profil' existe ( = exclure tags du header)
        if (ficheActive !== null) {
          ficheActive.classList.remove('desactiver')
        }
      })
      // si aucun tag sélectionné, afficher toutes les fiches
    } else {
      fichesPhotographes.forEach((fichePhotographe) => fichePhotographe.classList.remove('desactiver'))
    }
  },

  // fonctionnalité : affichage par tag
  trierParTag: function (tags) {
    tags.forEach(function (tagActif) {
      tagActif.addEventListener('click', () => {
        utilitaires.affichageParTagActif(tags, tagActif)
      })
    })
  }
}

//
// 3 - Éléments du DOM
//

// BOUTON RETOUR AU CONTENU PRINCIPAL
const constructeurBtnRetourMain = () => {
  const btnRetour = document.createElement('a')
  btnRetour.classList.add('btn-contenu-principal')
  btnRetour.setAttribute('href', '#contenu-principal')
  btnRetour.setAttribute('aria-hidden', 'true')
  btnRetour.innerText = 'Passer au contenu'
  corpsPage.prepend(btnRetour)

  utilitaires.apparitionAuScroll(200, btnRetour)
}

// HEADER
const constructeurHeader = (data) => {
  const header = document.createElement('header')
  header.classList.add('banniere')
  header.innerHTML = `
        <a href="index.html">
            <img class="logo" src="resources/img/logo.png" alt="FishEye : page d'accueil">
        </a>
        <nav aria-label="trier les photographes par categories">
          <ul class="nav-par-tag" >
            ${utilitaires.trierTableauTags(data).map(templates.navigationTag).join('')}
          </ul>
        </nav>
        <h1 tabindex="0">Nos photographes</h1>
`
  corpsPage.prepend(header)
}

// MAIN
const constructeurGaleriePhotographes = (data) => {
  // création du conteneur ul
  const photographesGalerie = document.createElement('ul')
  photographesGalerie.classList.add('photographes-galerie')
  corpsContenuPage.append(photographesGalerie)
  // appel du template de la fiche pour chaque photographe
  const dataFiche = data.photographers.map(templates.fichePhotographe).join('')
  // ajout de chaque fiche au conteneur
  photographesGalerie.innerHTML = dataFiche
}

//
// 5 - Génération de la page index
//
const constructeurIndex = (data) => {
  constructeurBtnRetourMain()
  constructeurHeader(data)
  constructeurGaleriePhotographes(data)

  const tags = document.querySelectorAll('.tag-entree')
  utilitaires.trierParTag(tags)
}
