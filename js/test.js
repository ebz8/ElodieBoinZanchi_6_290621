
// éléments du DOM
const corpsBody = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

// essai 2
async function recupData () {
  const reponse = await fetch('js/data/fisheyedata.json')
  const data = await reponse.json()

  console.log('tableau de data.photographers dans recupData')
  console.log(data.photographers)

  for (let i = 0; i < data.photographers.length; i++) {
    const newLi = document.createElement('li')
    const newTitre = document.createElement('h2')

    newTitre.innerText = 'nom : ' + data.photographers[i].name
    newTitre.classList.add('nom')
    newLi.appendChild(newTitre)
    newLi.classList.add('photographe-profil')
    corpsContenuPage.appendChild(newLi)
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
