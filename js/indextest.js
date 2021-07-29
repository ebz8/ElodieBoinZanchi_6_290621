
// TODO :
// Pour créer la PAGE INDEX :
// Générer le header (logo / nav par tags / title)
// Générer le main (ul / fiches photographes)
// Générer le bouton de retour vers le contenu principal
// (evenement) Créer la fonction tri par tag

// éléments du DOM
const corpsContenuPage = document.querySelector('.js-document')
const photographesGalerie = document.querySelector('.photographes-galerie')

// récupération des données JSON
const jsonData = async () => {
  try {
    const reponse = await fetch('js/data/fisheyedata.json')
    const data = await reponse.json()
    return data
  } catch (erreur) {
    console.log('Erreur dans le chargement des données. ' + ('( ') + erreur + (' )'))
  }
}

// chargement des données JSON au chargement de la page
const chargementData = async () => {
  const data = await jsonData()
  console.log(data)
  creerFichePhotographe(data)
}
document.addEventListener('DOMContentLoaded', chargementData)

function creerFichePhotographe (data) {
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

// async function testAffichage(){
//     await
//     console.log(photographeInfos)
// }

// const photographeInfos = await data

// async function testJson () {
//   await recupData()
//   console.log(data.photographers)
// }

// testJson()
