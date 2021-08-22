const selected = document.querySelector('.selected')
const conteneurOptions = document.querySelector('.conteneur-options')
const optionsListe = document.querySelectorAll('.option')

// par défaut : popularité
selected.innerHTML = optionsListe[0].querySelector('label').innerHTML

// afficher les options
selected.addEventListener('click', () => {
  selected.innerHTML = ''
  conteneurOptions.classList.toggle('active')
  selected.classList.toggle('selected-active')
})

// selection d'une option
optionsListe.forEach(o => {
  o.addEventListener('click', () => {
    selected.innerHTML = o.querySelector('label').innerHTML
    conteneurOptions.classList.remove('active')
    selected.classList.remove('selected-active')
  })
})
