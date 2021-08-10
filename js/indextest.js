
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

  // gestion du scroll
  window.addEventListener('scroll', () => {
    window.scrollTop < 100 ? btnRetour.setAttribute('aria-hidden', 'true') : btnRetour.removeAttribute('aria-hidden')
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
const templateTags = (tags) => {
  console.log('execution de templateTag')
  return `
    <ul class="nav-par-tag" >
    ${tags.filters((tag) => (tags === 'tags').map((tag)=>
    `<li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${tag}</a></li>`
    ).join(''))}
    </ul>`
}

const templateHeader = (data) => {
  const header = document.createElement('header')
  header.classList.add('banniere')
  header.innerHTML = `
        <a href="index.html">
            <img class="logo" src="resources/img/logo.png" alt="FishEye : page d'accueil">
        </a>
        <nav aria-label="trier les photographes par categories">
          ${templateTags(data)}
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
    <a href="photographer${photographe.id}.html">
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

// 5 - Génération générale de l'index
const constructeurIndex = (data) => {
  btnRetourMain()
  // templateHeader(data)
  fichesPhotographe(data)
}

// 6 - Fonctionnalité trier par tag
