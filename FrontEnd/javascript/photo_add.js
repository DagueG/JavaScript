import { works, showImageModal, getTokenFromCookie } from './user_works.js'

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
        <label for="photo">Photo:</label>
        <input type="file" id="photo" name="image" accept="image/*"><br><br>
    
        <label for="titre">Titre:</label>
        <input type="text" id="titre" name="title"><br><br>
    
        <label for="categorie">Catégorie:</label>
        <select id="categorie" name="category">
            <option value="1">Catégorie 1</option>
            <option value="2">Catégorie 2</option>
            <option value="3">Catégorie 3</option>
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
    
    const token = getTokenFromCookie();
    AddPhotoForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher l'action par défaut du formulaire
    
        // Récupérer les données du formulaire
        var formData = new FormData(AddPhotoForm);
        // Ajouter la variable token à la requête
        formData.append('token', token);
        // Créer un objet d'en-têtes
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
    
        // Envoi de la requête AJAX
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: headers,
            body: formData,
            redirect: "follow"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la requête');
            }
            return response.json();
        })
        .then(data => {
            // Gérer la réponse si nécessaire
            console.log('Réponse du serveur :', data);
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    });
}
