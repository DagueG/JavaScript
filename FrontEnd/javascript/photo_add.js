import { works, showImageModal } from './user_works.js'

export function showAddPhotoModal() {

    const modalImage = document.querySelector('.image-modal');

    var backButton = document.createElement('button');
    backButton.classList.add('back-button');

    // Créer un élément <span> pour le symbole de la flèche
    var arrowSpan = document.createElement('img');
    arrowSpan.src = './assets/icons/arrow-left-solid.svg';

    backButton.appendChild(arrowSpan);

    // Écouteur d'événement sur le bouton
    backButton.onclick = function() {
        // Revenir à la modal précédente
        document.querySelector('.overlay').remove();
        modalImage.remove();
        showImageModal(works);
    };

    // Insérer le bouton avant le premier enfant de la modal
    modalImage.insertBefore(backButton, modalImage.firstChild);
}
