// éléments du DOM
// const corpsBody = document.querySelector('.js-page')
const corpsContenuPage = document.querySelector('.js-document')

// récupération des données JSON
async function recupData () {
  const reponse = await fetch('js/data/fisheyedata.json')
  const data = await reponse.json()

  const newLi = document.createElement('li')
  const newTitre = document.createElement('h2')
  console.log('coucou depuis fonction recupData')
  console.log(data.photographers)

  for (let i = 0; i < data.photographers.lenght; i++) {
    newTitre.innerText = 'nom' + data.photographers[i].name
    newLi.appendChild(newTitre)
    corpsContenuPage.appendChild(newLi)
    console.log('coucou depuis la boucle data json')
  }
}

recupData().catch(erreur => {
  console.log('Erreur dans le chargement des données. ' + ('( ') + erreur  + (' )'))
})

// fetch('js/data/fisheyedata.json')
//   .then(reponse => reponse.json())
//   .then(data => {
//     // console.log(data.photographers)

//     for (let i = 0; i < data.photographers.lenght; i++) {
//       console.log('coucou')
//       let photographeTableau = []
//       const newLi = document.createElement('li')
//       const newTitre = document.createElement('h2')

//       newTitre.innerText = 'nom' + data.photographers[i].name
//       newLi.appendChild(newTitre)
//       corpsContenuPage.appendChild(newLi)
//     }
//   })
//   .catch(erreur => {
//     console.log('Erreur dans le chargement des données: ' + erreur)
//   })
