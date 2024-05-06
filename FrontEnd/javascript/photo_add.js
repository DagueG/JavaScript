import { showImageModal, getTokenFromCookie, fetchWorks, genererWork } from './user_works.js'

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
    <div id="modal-content">
    <div id="origin-content-add">
        <i class="fa-regular fa-image"></i>
        <label for="photo">
            <span class="file_add_button">+ Ajouter photo</span>
            <input type="file" id="photo" name="image" accept="image/*" required><br><br>
        </label>
        <span class="file_add_description">jpg, png : 4mo max</span>
    </div>
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
        <input id="validate-pic" type="submit" value="Valider" class="modal-add-button">
    </div>
    `;
    AddPhotoForm.classList.add("AddPhotoForm");
    AddPhotoForm.action = "#";
    AddPhotoForm.method = "post";
    AddPhotoForm.enctype = "multipart/form-data";
    AddPhotoForm.innerHTML = AddPhotoFormHTML;
    modalImage.insertBefore(AddPhotoForm, document.querySelector('.modal-images-list'));
    document.querySelector('.modal-images-list').remove();
    
    const photoInput = document.getElementById('photo');
    const titreInput = document.getElementById('titre');
    const categorieInput = document.getElementById('categorie');
    const submitButton = document.getElementById('validate-pic');
    const checkInputs = () => {
        if (photoInput.value && titreInput.value && categorieInput.value) {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#1D6154";
        } else {
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "";
        }
    };

    photoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const modalContent = document.getElementById('modal-content');
            const originContentAdd = document.getElementById('origin-content-add');
            const img = document.createElement('img');
            img.src = e.target.result;
            originContentAdd.style.display = 'none';
            modalContent.style.padding = '0';
            modalContent.appendChild(img);
            checkInputs();
        };

        reader.readAsDataURL(file);
    });

    titreInput.addEventListener('input', checkInputs);
    categorieInput.addEventListener('input', checkInputs);

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
        genererWork(works);
        showImageModal(works);
    });
}
