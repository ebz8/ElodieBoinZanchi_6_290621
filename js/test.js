
// éléments du DOM
const corpsContenuPage = document.querySelector('.js-document')
const photographesGalerie = document.querySelector('.photographes-galerie')

// récupération des données JSON (essai 2)
async function recupData () {
  const reponse = await fetch('js/data/fisheyedata.json')
  const data = await reponse.json()

  console.log('tableau de data.photographers dans recupData:')
  console.log(data.photographers)

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

recupData().catch(erreur => {
  console.log('Erreur dans le chargement des données. ' + ('( ') + erreur + (' )'))
})

// essai 1
// const getPhotographes = async () => {
//   try {
//     const reponse = await fetch('js/data/fisheyedata.json')
//     if (reponse.ok) {
//       const data = await reponse.json()
//       console.log('depuis getPhotographes')
//       console.log(data)
//     } else {
//       console.error('erreur signalée:', reponse.status)
//     }
//   } catch (erreur) {
//     console.log(erreur)
//   }
// }

// getPhotographes()

// essai 3
// fetch('js/data/fisheyedata.json')
//   .then(reponse => reponse.json())
//   .then(data => {
//     appendData(data)
//   })
//   .catch(erreur => {
//     console.log('Erreur dans le chargement des données: ' + erreur)
//   })
// function appendData (data) {
//   const corpsContenuPage = document.querySelector('.js-document')
//   console.log('coucou depuis appendData')

//   for (let i = 0; i < data.length; i++) {
//     console.log('coucou depuis la boucle appendData')
//     const newLi = document.createElement('li')
//     const newTitre = document.createElement('h2')
//     newTitre.innerText = 'nom' + data[i].photographers.name
//     newLi.appendChild(newTitre)

//     corpsContenuPage.appendChild(newLi)
//   }
// }
