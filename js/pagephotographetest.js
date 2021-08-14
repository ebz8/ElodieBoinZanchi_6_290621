
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

// 1 - récupération des données JSON

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
// 3 - récupération de l'ID
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const photographeID = urlParams.get('id')
console.log(`récupération de l'ID : ${photographeID}`)

// 2 - chargement des données JSON au chargement de la page
// stockées dans currentPhotographe et currentPhotographeMedias

const chargementData = async () => {
  const data = await jsonData()
  const photographe = data.photographers
  const mediasPhotographe = data.media
  // const currentPhotographeMedias = []

  for (const i in photographe) {
    if (photographe[i].id == photographeID) {
      for (const x in mediasPhotographe) {
        if (mediasPhotographe[x].photographerId == photographeID) {
          const currentPhotographeMedias = mediasPhotographe[x]
          console.log(currentPhotographeMedias)
        }
      }
      const currentPhotographe = photographe[i]
      console.log(`photographe actuel : ${photographeID}`)
            // constructeurPagePhotographe(currentPhotographe, currentPhotographeMedias)
      constructeurPagePhotographe(currentPhotographe)
    }
  }
}
document.addEventListener('DOMContentLoaded', chargementData)

// 3 - Génération des composants de la page

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

// création du bouton de contact
// <!-- bouton de contact -->
//           <button type="button"
//           aria-haspopup="dialog" aria-controls="dialog"
//           id="btn-modale" class="btn-formulaire btn-principal">
//               Contactez-moi
//           </button>

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

// 4 - Génération de la page
const constructeurPagePhotographe = (currentPhotographe) => {
  templateHeader()
  bannierePhotographe(currentPhotographe)
}
