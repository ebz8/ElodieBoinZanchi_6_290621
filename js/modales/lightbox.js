/**
----------------------------------------------------
5 - Lightbox et fonctionnalités
----------------------------------------------------
*/
class Lightbox {
    static init (medias) {
      const vignettes = Array.from(document.querySelectorAll('.apercu-photo a'))
      vignettes.forEach(vignette => vignette.addEventListener('click', (e) => {
        e.preventDefault()
        const idVignetteEnCours = e.currentTarget.getAttribute('id')
        const mediaEnCours = medias.find(media => media.id == idVignetteEnCours)
        // eslint-disable-next-line no-new
        new Lightbox(mediaEnCours, medias)
      })
      )
    }
  
    constructor (mediaEnCours, medias) {
      this.lightbox = this.creerLightbox()
      this.medias = medias
      this.mediaEnCours = mediaEnCours
      this.affichageLightbox()
      this.chargerMedia(mediaEnCours)
      this.gestionClavier = this.gestionClavier.bind(this)
      document.addEventListener('keyup', this.gestionClavier)
      corpsPage.appendChild(this.lightbox)
    }
  
    creerLightbox () {
      const conteneurLightbox = document.createElement('section')
      conteneurLightbox.classList.add('lightbox')
      utilitaires.definirAttributs(conteneurLightbox, { role: 'dialog', 'aria-label': 'image en plein écran', 'aria-hidden': 'true', 'aria-modal': 'true' })
  
      conteneurLightbox.innerHTML = `
                      <!-- composants lightbox -->
                      <div class="lightbox__commandes">
                        <button class="gauche" aria-label="image précédente"><i class="fas fa-chevron-left"></i> </button>
                        <button class="droite" aria-label="image suivante"><i class="fas fa-chevron-right"></i></button>
                        <button class="btn-fermeture" aria-label="fermer la lightbox"></button>
                      </div>
                      <ul class="lightbox__contenu">
                      </ul>
    `
      conteneurLightbox.querySelector('.btn-fermeture').addEventListener('click', this.fermetureLightbox.bind(this))
      conteneurLightbox.querySelector('.droite').addEventListener('click', this.suivante.bind(this))
      conteneurLightbox.querySelector('.gauche').addEventListener('click', this.precedente.bind(this))
      return conteneurLightbox
    }
  
    affichageLightbox () {
      corpsContenuPage.setAttribute('aria-hidden', 'true')
      corpsPage.style.overflow = 'hidden'
      this.lightbox.setAttribute('aria-hidden', 'false')
    }
  
    fermetureLightbox (e) {
      e.preventDefault()
      corpsContenuPage.setAttribute('aria-hidden', 'false')
      corpsPage.style.overflow = 'scroll'
      // this.lightbox.setAttribute('aria-hidden', 'true')
      this.lightbox.remove()
      document.removeEventListener('keydown', this.gestionClavier)
    }
  
    chargerMedia (mediaAffiche) {
      const conteneurLightbox = this.lightbox.querySelector('.lightbox__contenu')
      this.mediaEnCours = mediaAffiche
      if (this.mediaEnCours.image !== undefined) {
        conteneurLightbox.innerHTML =
      `<li>
          <figure role="group" aria-label="${this.mediaEnCours.title}">
            <img src="resources/img/photographers/${this.mediaEnCours.photographerId}/${this.mediaEnCours.image}" alt="${this.mediaEnCours.description}" loading="lazy" aria-label="${this.mediaEnCours.title}">
            <figcaption class="photo-titre">${this.mediaEnCours.title}</figcaption>
          </figure>
        </li>`
      } else {
        conteneurLightbox.innerHTML =
      `<li>
        <figure role="group" aria-label="${this.mediaEnCours.title}">
          <video alt="${this.mediaEnCours.description}" controls="controls" loop="" <="" video="" aria-label="${this.mediaEnCours.title}">
            <source src="resources/video/photographers/${this.mediaEnCours.photographerId}/${this.mediaEnCours.video}" alt="${this.mediaEnCours.description}" type="video/mp4" loading="lazy">
          </video>
          <figcaption class="photo-titre">${this.mediaEnCours.title}</figcaption>
        </figure>
      </li>`
      }
      // diriger le focus sur le média en cours
      const mediasFocusables = ['img', 'video']
      const tableauMediasFocusables = conteneurLightbox.querySelectorAll(mediasFocusables)
      tableauMediasFocusables[0].focus()
    }
  
    suivante (e) {
      e.preventDefault()
      // rechercher l'index du média en cours
      let indexMediaEnCours = this.medias.findIndex(media => media === this.mediaEnCours)
      // quand dernier média du tableau, retourner au premier
      if (indexMediaEnCours === this.medias.length - 1) {
        indexMediaEnCours = -1
      }
      // +1 à l'index du média cours
      const mediaSuivant = this.medias[indexMediaEnCours + 1]
      this.chargerMedia(mediaSuivant)
    }
  
    precedente (e) {
      e.preventDefault()
      // rechercher l'index du média en cours
      let indexMediaEnCours = this.medias.findIndex(media => media === this.mediaEnCours)
      // quand premier média du tableau, aller au dernier
      if (indexMediaEnCours === 0) {
        indexMediaEnCours = this.medias.length
      }
      // -1 à l'index du média cours
      const mediaPrecedent = this.medias[indexMediaEnCours - 1]
      this.chargerMedia(mediaPrecedent)
    }
  
    gestionClavier (e) {
      if (e.key === 'Escape' || e.code === 'Escape') {
        this.fermetureLightbox(e)
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        this.precedente(e)
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        this.suivante(e)
      }
    }
  }