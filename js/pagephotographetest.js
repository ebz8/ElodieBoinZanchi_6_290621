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
// 3 - récupération de l'ID du photographe en cours

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

// ici rajouter une condition : if jpg ... ou if vidéo
// const isImage = (media) => media.image !== undefined;
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

// 4 - Génération de la page
const constructeurPagePhotographe = (currentPhotographe, currentPhotographeMedias) => {
  templateHeader()
  bannierePhotographe(currentPhotographe)
  blocFixe(currentPhotographe)
  photographeGalerie(currentPhotographe, currentPhotographeMedias)

  console.log('chargement général')
  console.log(currentPhotographeMedias)
}
