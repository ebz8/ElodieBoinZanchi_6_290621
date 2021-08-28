/**
-------------------------------------
PAGE INDEX
-------------------------------------
*/

// TODO :
// Pour créer la PAGE INDEX :
// Récupérer les données json et les stocker
// Générer le bouton de retour vers le contenu principal
// Générer le header (logo / nav par tags / title)
// Générer le main (ul / fiches photographes)
// (evenement) Créer la fonction tri par tag

// éléments du DOM
const corpsPage = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

// 1 - récupération des données JSON

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

// 2 - chargement des données JSON au chargement de la page

const chargementData = async () => {
  const data = await jsonData()
  constructeurIndex(data)
  console.log(data.photographers.tags)
}
document.addEventListener('DOMContentLoaded', chargementData)

// 3 - Stocker data.photographers dans une constante (?)

// const dataPhotographes = jsonData()
// console.log(dataPhotographes)

// 4 - Générer les éléments HTML individuellement

// BTN CONTENU-PRINCIPAL
// display seulement si scroll(x)
//
const btnRetourMain = () => {
  // création du bouton
  console.log('execution btnRetourMain')
  const btnRetour = document.createElement('a')
  btnRetour.classList.add('btn-contenu-principal')
  btnRetour.setAttribute('href', '#contenu-principal')
  btnRetour.innerText = 'Passer au contenu'
  corpsPage.prepend(btnRetour)
  btnRetour.setAttribute('aria-hidden', 'true')

  // gestion du scroll
  window.addEventListener('scroll', () => {
    // console.log(window.scrollY)
    window.scrollY > 200 ? btnRetour.removeAttribute('aria-hidden') : btnRetour.setAttribute('aria-hidden', 'true')
  })

  // gestion du clic
  btnRetour.addEventListener('click', () => {
    window.scrollTop = 0
  })
}

//
// HEADER
//
// navigation par tag
// const templateTags = (tag) => {
//   console.log('execution de templateTag')
//   console.log(tag)
//   return `<li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
// }

const templateNavTags = (tag) => {
  return `
  <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
}

const templateHeader = (data) => {
  // récupération des tags dans un tableau vide
  let tableauTags = []
  data.photographers.map(tag => {
    tag.tags.map(tag => tableauTags.push(tag))
  })

  // tri et suppression des doublons :
  const tagUnique = new Set(tableauTags)
  const listeTags = [...tagUnique]

  const header = document.createElement('header')
  header.classList.add('banniere')
  header.innerHTML = `
        <a href="index.html">
            <img class="logo" src="resources/img/logo.png" alt="FishEye : page d'accueil">
        </a>
        <nav aria-label="trier les photographes par categories">
        <ul class="nav-par-tag" >

          ${listeTags.map(templateNavTags).join('')}
          </ul>
        </nav>
        <h1 tabindex="0">Nos photographes</h1>
`
  corpsPage.prepend(header)
  console.log('templateHeader généré')
}

//
// MAIN
//

// const templateMain = () => {
//   const main = document.createElement('main')
//   main.classList.add('js-document')
//   main.setAttribute('id', 'contenu-principal')
//   corpsPage.appendChild(main)
//   // main.innerHTML = `
//   // <ul class="photographes-galerie">
//   // </ul>`
//   // ajouter les fiches photographes (?)
//   // main.appendChild(fichePhotographe)
//   console.log('templateMain généré')
// }

// hashtags des fiches photographe
const tagsParPhotographe = (tags) => {
  return `
  <ul class="nav-par-tag" >
  ${tags.map((tag) =>
   `<li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
  ).join('')}
  </ul>`
}

// template complet d'une fiche photographe
const templateFiche = (photographe) => {
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
                  ${tagsParPhotographe(photographe.tags)}
    </li>`
}

const fichesPhotographe = (data) => {
  // création du conteneur ul
  const photographesGalerie = document.createElement('ul')
  photographesGalerie.classList.add('photographes-galerie')
  corpsContenuPage.append(photographesGalerie)

  // appel du template de la fiche pour chaque photographe
  const dataFiche = data.photographers.map(templateFiche).join('')

  // ajout de chaque fiche au conteneur
  photographesGalerie.innerHTML = dataFiche
  console.log('fiches photographe générées')
}

// 5 - Fonctionnalité trier par tag

function affichageParTag (tags, tagActif) {
  const fichesPhotographes = document.querySelectorAll('.photographe-profil')
  const tagsRetenus = []

  // Pour chaque tag, vérifier que le tag actuel et le tag cliqué correspondent
  tags.forEach((tag) => {
    // si oui, modifier statut (activer) de la classe active
    if (tag.textContent.toLowerCase() === tagActif.textContent.toLowerCase()) {
      tag.classList.toggle('active')
    // sinon, retirer la classe active
    } else {
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
}

// 6 - Génération générale de l'index
const constructeurIndex = (data) => {
  btnRetourMain()
  templateHeader(data)
  fichesPhotographe(data)

  // fonctionnalité de tri d'affichage
  const tags = document.querySelectorAll('.tag-entree')
  tags.forEach(function (tagActif) {
    tagActif.addEventListener('click', () => {
      this.affichageParTag(tags, tagActif)
    })
  })
}
