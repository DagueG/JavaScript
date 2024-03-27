import { works, showImageModal } from './user_works.js'

export function showAddPhotoModal() {

    const modalImage = document.querySelector('.image-modal');

    var backButton = document.createElement('button');
    backButton.classList.add('back-button');
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
    modalImage.insertBefore(backButton, modalImage.firstChild);

    var title = document.querySelector('.modal-title');
    title.textContent = "Ajout photo"

    var AddPhotoForm = document.createElement('form');
    const AddPhotoFormHTML = `
        <label for="photo">Photo:</label>
        <input type="file" id="photo" name="photo" accept="image/*"><br><br>

        <label for="titre">Titre:</label>
        <input type="text" id="titre" name="titre"><br><br>

        <label for="categorie">Catégorie:</label>
        <select id="categorie" name="categorie">
            <option value="categorie1">Catégorie 1</option>
            <option value="categorie2">Catégorie 2</option>
            <option value="categorie3">Catégorie 3</option>
        </select><br><br>

        <input type="submit" value="Valider">
`;
    AddPhotoForm.classList.add("AddPhotoForm");
    AddPhotoForm.action = "#";
    AddPhotoForm.method = "post";
    AddPhotoForm.enctype = "multipart/form-data";
    AddPhotoForm.innerHTML = AddPhotoFormHTML;
    modalImage.insertBefore(AddPhotoForm, document.querySelector('.modal-images-list'));

    document.querySelector('.modal-images-list').remove();
    document.querySelector('.modal-add-button').remove();
    

}
