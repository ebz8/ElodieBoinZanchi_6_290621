// éléments du DOM
const corpsPage = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')
const contenuMain = document.getElementById('contenu-principal')
const photographesGalerie = document.querySelector('.photographes-galerie')

// récupération des données JSON
const apiUrl = '/js/data/fisheyedata.json'
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
  console.log(data)
  creerFichePhotographe(data)
}
document.addEventListener('DOMContentLoaded', chargementData)

// 4 - Générer les éléments HTML
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
  corpsPage.appendChild(header)
}

const creerFichePhotographe = (data) => {
  console.log(data)

  for (let i = 0; i < data.photographers.length; i++) {
    const newLi = document.createElement('li')
    const newImg = document.createElement('img')
    const newTitre = document.createElement('h2')
    const newDiv = document.createElement('div')
    const newPara = document.createElement('p')
    const newSpan = document.createElement('p')

    newTitre.innerText = data.photographers[i].name
    newTitre.classList.add('nom')
    // vignette
    newLi.appendChild(newImg)
    newImg.src = 'resources/img/photographers/IDphotos/' + data.photographers[i].portrait
    newImg.classList.add('vignette')
    // nom
    newLi.appendChild(newTitre)
    // bloc infos :
    newLi.appendChild(newDiv)
    // ville
    newDiv.appendChild(newPara)
    newPara.innerText = data.photographers[i].city
    newPara.classList.add('localisation')
    // accroche
    newDiv.appendChild(newPara)
    newPara.innerText = data.photographers[i].tagline
    newPara.classList.add('accroche')
    // prix
    newDiv.appendChild(newSpan)
    newSpan.innerText = data.photographers[i].price + '€ /jour'
    newSpan.classList.add('tarif')

    // fiche photographe
    newLi.classList.add('photographe-profil')
    photographesGalerie.appendChild(newLi)
  }
}

function templateIndex () {
  templateHeader()
  // templateMain()
  // fichePhotographe()
}
templateIndex()


// // chargement des données JSON au chargement de la page
// const chargementData = async () => {
//   const data = await jsonData()
//   listePhotographes(data)
// }
// document.addEventListener('DOMContentLoaded', chargementData)

// function Photographe (data) {
//   let photographes = [data.photographers]
//   // console.log(photographes)

//   this.render = function () {
//     const galeriePhotographes = document.createElement('ul')
//     galeriePhotographes.classList.add('photographes-galerie')

//     photographes.forEach((data) => {
//       console.log(`${data.name}`)
//       const itemListe = document.createElement('li')
//       itemListe.classList.add('photographe-profil')
//       itemListe.innerHTML = `
//       <a href="photographer${data.id}.html">
//       <img class="vignette" src="resources/img/photographers/IDphotos/${data.name}.jpg" alt=" "/>
//       <h2 class="nom">${data.name}</h2>
//     </a>
//     <div tabindex="0">
//       <p class="localisation">${data.city}, ${data.country}</p>
//       <p class="accroche">${data.tagline}</p>
//       <span class="tarif">${data.price}€</span><span class="tarif" aria-label="par jour">/jour</span>
//     </div>
//     <ul class="nav-par-tag" >
//       <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Portrait</a></li>
//       <li class="tag-entree"><a href="#"><span aria-label="hashtag">#</span>Art</a></li>
//     </ul>
//   `
//       galeriePhotographes.append(itemListe)
//     })

//     contenuMain.append(galeriePhotographes)
//   }
// }

// listePhotographes.render()




// version classes

// class Photographe{
//   name
//   id
//   city
//   country
//   tags
//   tagline
//   price
//   portrait

//   constructor(name, id, city, country, tags, tagline, price, portrait){
//     this.name = name
//     this.id = id
//     this.city = city
//     this.country = country
//     this.tags = tags
//     this.tagline = tagline
//     this.price = price
//     this.portrait = portrait
//   }
// }
