import { works, showImageModal } from './user_works.js'

export function showAddPhotoModal() {

    const modalImage = document.querySelector('.image-modal');

    var backButton = document.createElement('img');
    backButton.classList.add('back-button')
    backButton.src = './assets/icons/arrow-left-solid.svg';
    backButton.onclick = function() {
        // Revenir à la modal précédente
        document.querySelector('.overlay').remove();
        modalImage.remove();
        showImageModal(works);
    };
    modalImage.appendChild(backButton);

}