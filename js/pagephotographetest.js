
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

  for (const i in photographe) {
    if (photographe[i].id == photographeID) {
      for (const j in mediasPhotographe) {
        if (mediasPhotographe[j].photographerId == photographeID) {
          const currentPhotographeMedias = mediasPhotographe[j]
          console.log(currentPhotographeMedias)
        }
      }
      const currentPhotographe = photographe[i]
      console.log(`photographe actuel : ${photographeID}`)
      //   constructeurPagePhotographe(currentPhotographe, currentPhotographeMedias)
    }
  }
}
document.addEventListener('DOMContentLoaded', chargementData)
