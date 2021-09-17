/**
----------------------------------------------------
4 - Formulaire et fonctionnalités
----------------------------------------------------
*/

export class Formulaire {
  static init (photographe) {
    new Formulaire(photographe)
  }

  constructor (photographe) {
    this.formulaire = this.creerFormulaire(photographe)
    this.gestionSaisie = this.gestionSaisie.bind(this)
    this.gestionClavier = this.gestionClavier.bind(this)
    document.addEventListener('keyup', this.gestionClavier)
    corpsPage.appendChild(this.formulaire)
  }

  creerFormulaire (photographe) {
    console.log('création formulaire')
    const sectionFormulaire = document.createElement('section')
    sectionFormulaire.classList.add('modale-formulaire')
    utilitaires.definirAttributs(sectionFormulaire, { id: 'dialog', role: 'dialog', 'aria-labelledby': 'titre-formulaire', 'aria-modal': 'true', 'aria-hidden': 'true' })
    sectionFormulaire.innerHTML = templates.sectionFormulaire(photographe)

    // affichage du formulaire
    document.querySelector('#btn-modale').addEventListener('click', this.affichageFormulaire.bind(this))
    // dissimulation du formulaire
    sectionFormulaire.querySelector('.modale-formulaire .btn-fermeture').addEventListener('click', this.fermetureFormulaire.bind(this))
    // gestion au clavier du formulaire
    // contrôle de la saisie des champs du formulaire
    sectionFormulaire.querySelector('#btn-envoi').addEventListener('click', this.gestionSaisie.bind(this))
    return sectionFormulaire
  }

  affichageFormulaire () {
    corpsContenuPage.setAttribute('aria-hidden', 'true')
    corpsPage.style.overflow = 'hidden'
    this.formulaire.setAttribute('aria-hidden', 'false')
    utilitaires.gestionFocusModale(this.formulaire)
  }

  fermetureFormulaire () {
    corpsContenuPage.setAttribute('aria-hidden', 'false')
    corpsPage.style.overflow = 'scroll'
    this.formulaire.setAttribute('aria-hidden', 'true')
    // document.querySelector('#btn-modale').focus()
  }

  gestionClavier (e) {
    if (e.key === 'Escape' || e.code === 'Escape') {
      this.fermetureFormulaire()
    }
  }

  gestionSaisie (e) {
    e.preventDefault()

    const formChamps = document.forms['formulaire-contact']
    const messageErreur = document.querySelector('.erreur-saisie')
    // expressions régulières
    const regexNom = /^(?=[a-zA-ZéèîïÉÎÏ\s]{2,25}$)(?=[a-zA-Z\s])(?:([\w\s*?])\1?(?!\1))+$/
    const regexMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

    let typeErreur
    // vérifier la validité des infos saisies
    if (regexNom.test(formChamps.prenom.value) === false) {
      typeErreur = 'Veuillez saisir un prénom valide : deux caractères minimum et chiffres interdits.'
    } else if (regexNom.test(formChamps.nom.value) === false) {
      typeErreur = 'Veuillez saisir un nom valide : deux caractères minimum et chiffres interdits.'
    } else if (regexMail.test(formChamps.email.value) === false) {
      typeErreur = 'Veuillez saisir un email valide : doit correspondre au format mail@mail.com.'
    }
    // vérifier que les champs ne sont pas vides
    for (let i = 0; i < formChamps.length; i++) {
      if (!formChamps[i].value) {
        typeErreur = 'Veuillez renseigner tous les champs.'
      }
    }
    // si erreur de saisie, affichage message d'erreur spécifique
    if (typeErreur) {
      e.preventDefault()
      messageErreur.innerHTML = typeErreur
      messageErreur.classList.add('erreur-saisie--active')
    } else {
      // afficher les données saisies puis effacer le formulaire
      for (let i = 0; i < formChamps.length - 1; i++) {
        console.log(formChamps[i].value)
        formChamps[i].value = ''
      }
      messageErreur.innerHTML = ' '
      // message de confirmation et fermeture de la fenêtre
      alert('Votre message a bien été envoyé.')
      this.fermetureFormulaire()
    }
  }
}