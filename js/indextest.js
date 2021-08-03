
// TODO :
// Pour créer la PAGE INDEX :
// Récupérer les données json
// Générer le header (logo / nav par tags / title)
// Générer le main (ul / fiches photographes)
// Générer le bouton de retour vers le contenu principal
// (evenement) Créer la fonction tri par tag

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

// 2 - chargement des données JSON au chargement de la page
const chargementData = async () => {
  const data = await jsonData()
  fichesPhotographe(data)
}
document.addEventListener('DOMContentLoaded', chargementData)

// 3 - stocker data.photographers dans une constante (?)
// const dataPhotographes = jsonData()
// console.log(dataPhotographes)

// 4 - Générer les éléments HTML individuellement
const templateHeader = () => {
  const header = document.createElement('header')
  header.classList.add('banniere')
  header.innerHTML = `
        <a href="index.html">
            <img class="logo" src="resources/img/logo.png" alt="FishEye : page d'accueil">
        </a>

        <nav aria-label="trier les photographes par categories">
            <ul class="nav-par-tag" >
            </ul>
        </nav>
        <h1 tabindex="0">Nos photographes</h1>
`
  corpsPage.prepend(header)
  console.log('templateHeader généré')
}
templateHeader()

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

const fichesPhotographe = (data) => {
  const photographesGalerie = document.createElement('ul')
  photographesGalerie.classList.add('photographes-galerie')
  corpsContenuPage.append(photographesGalerie)

  const dataFiche = data.photographers.map(function (photographe) {
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
                  <ul class="nav-par-tag" >
                      <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>${photographe.tags}</a></li>
                      <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Art</a></li>
                  </ul>
    </li>`
  }).join('')

  photographesGalerie.innerHTML = dataFiche
  console.log('fiches photographes générées')
}

// 5 - Générer entièrement l'index
// function templateIndex () {
//   templateHeader()
//   fichePhotographe()
//   console.log('Index généré')
// }
// templateIndex()

// tentatives:

// const tableauPhotographes = (data) => {
//   return data.photographers
// }

// const Photographe = (data) => {
//   this.name = data.photographers.name
//   this.id = data.photographers.id
//   this.city = data.photographers.city
//   this.country = data.photographers.country
//   this.tags = data.photographers.tags
//   this.tagline = data.photographers.tagline
//   this.price = data.photographers.price
//   this.portrait = data.photographers.portrait
//   console.log(data)
// }

// function fichePhotographe (data) {
//   let listePhotographes = data.photographers

//   let photographesGalerie = document.createElement('ul')
//   photographesGalerie.classList.add('photographes-galerie')
//   console.log(listePhotographes)

//   listePhotographes.forEach((data) => {
//     let fichePhotographe = document.createElement('li')
//     const contenuFiche = `
//     <li class="photographe-profil">
//       <a href="photographer-page.html">
//                       <img class="vignette" src="resources/img/photographers/IDphotos/${data.photographers.name}.jpg" alt=" "/>
//                       <h2 class="nom">${data.photographers.name}</h2>
//                   </a>
//                   <div tabindex="0">
//                       <p class="localisation">${data.photographers.location}</p>
//                       <p class="accroche">${data.photographers.tagline}</p>
//                       <span class="tarif">${data.photographers.price}€</span><span class="tarif" aria-label="par jour">/jour</span>
//                   </div>
//                   <ul class="nav-par-tag" >
//                       <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Portrait</a></li>
//                       <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Art</a></li>
//                   </ul>
//                   </li>
//                   `
//     fichePhotographe.innerHTML = contenuFiche
//     photographesGalerie.appendChild(fichePhotographe)
//   })
// }

// fichePhotographe()

// const Photographe = (data) => {
//   this.name = data.photographers.name
//   this.location = data.photographers.location
// }
// const photograhe = new Photograph()

// const creerFichePhotographe = (data) => {
// const newLi = document.createElement('li')
// newLi.classList.add('photographe-profil')
// newLi.innerHTML = `
//   <a href="photographer-page.html">
//                   <img class="vignette" src="resources/img/photographers/IDphotos/${data.photographers.name}.jpg" alt=" "/>
//                   <h2 class="nom">${data.photographers.name}</h2>
//               </a>
//               <div tabindex="0">
//                   <p class="localisation">${data.photographers.city}</p>
//                   <p class="accroche">${data.photographers.tagline}</p>
//                   <span class="tarif">${data.photographers.price}€</span><span class="tarif" aria-label="par jour">/jour</span>
//               </div>

//               <ul class="nav-par-tag" >
//                   <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Portrait</a></li>
//                   <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Art</a></li>
//               </ul>
//               `
// photographesGalerie.appendChild(newLi)
// }
// creerFichePhotographe()

// function fichePhotographe (data) {
//   console.log(data)
//   data.photographers.map(creerFichePhotographe)
// }
// fichePhotographe()
