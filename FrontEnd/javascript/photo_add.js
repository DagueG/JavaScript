import { showImageModal, getTokenFromCookie, fetchWorks } from './user_works.js'

export function showAddPhotoModal() {

    const modalImage = document.querySelector('.image-modal');
    modalImage.classList.add("AddPhotoModale")
    let backButton = document.createElement('button');
    backButton.classList.add('back-button');
    let arrowSpan = document.createElement('img');
    arrowSpan.src = './assets/icons/arrow-left-solid.svg';
    backButton.appendChild(arrowSpan);
    backButton.onclick = function() {
        document.querySelector('.overlay').remove();
        modalImage.remove();
        const works = JSON.parse(localStorage.getItem("works"));
        showImageModal(works);
    };
    modalImage.insertBefore(backButton, modalImage.firstChild);
    document.querySelector('.add-button-container').remove();

    let title = document.querySelector('.modal-title');
    title.textContent = "Ajout photo";
    title.classList.add("Add-pic");

    let AddPhotoForm = document.createElement('form');
    const AddPhotoFormHTML = `
    <div class="modal-content">
    <i class="fa-regular fa-image"></i>
    <label for="photo"></label>
        <input type="file" id="photo" name="image" accept="image/*" required><br><br>
    </div>
    
        <label for="titre">Titre</label>
        <input type="text" id="titre" name="title" required><br><br>
    
        <label for="categorie">Catégorie</label>
        <select id="categorie" name="category" required>
            <option value="" disabled selected hidden></option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
        </select><br><br>

        <div class="add-button-container">
            <input type="submit" value="Valider" class="modal-add-button">
        </div>
        `;
    AddPhotoForm.classList.add("AddPhotoForm");
    AddPhotoForm.action = "#";
    AddPhotoForm.method = "post";
    AddPhotoForm.enctype = "multipart/form-data";
    AddPhotoForm.innerHTML = AddPhotoFormHTML;
    modalImage.insertBefore(AddPhotoForm, document.querySelector('.modal-images-list'));

    document.querySelector('.modal-images-list').remove();
    
    const token = getTokenFromCookie();
    AddPhotoForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        let formData = new FormData(AddPhotoForm);
        formData.append('token', token);
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
    
        await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: headers,
            body: formData,
            redirect: "follow"
        })
        document.querySelector('.overlay').remove();
        modalImage.remove();
        const works = await fetchWorks();
        showImageModal(works);
    });
}
