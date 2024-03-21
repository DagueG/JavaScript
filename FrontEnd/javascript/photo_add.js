import { works, showImageModal } from './user_works.js'

export function showAddPhotoModal() {

    const modalImage = document.querySelector('.image-modal');

    var backButton = document.createElement('button');
    backButton.classList.add('back-button')
    backButton.onclick = function() {
        // Revenir à la modal précédente
        document.querySelector('.overlay').remove();
        modalImage.remove();
        showImageModal(works);
    };
    modalImage.appendChild(backButton);

}