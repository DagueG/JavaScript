import { showAddPhotoModal } from './photo_add.js'

const reponse = await fetch('http://localhost:5678/api/works');
export const works = await reponse.json();

function eventLogin(works) {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', () => {
        toggleLoginForm(works);
    });    
}

function genererWork(works) {
    for (let i = 0; i < works.length; i++) {
        const article = works[i];
        const sectionFiches = document.querySelector(".gallery");
        const worksElements = document.createElement("figure");
        const imageElements = document.createElement("img");
        const figcaptionElements = document.createElement("figcaption")
        imageElements.src = article.imageUrl;
        imageElements.alt = article.title;
        figcaptionElements.innerText = article.title;
        sectionFiches.appendChild(worksElements);
        worksElements.appendChild(imageElements);
        worksElements.appendChild(figcaptionElements);
    }
}

function genererCategories(works) {
    // lister les catégories
    const categoriesSet = new Set();
    categoriesSet.add('Tous');
    for (let i = 0; i < works.length; i++) {
        const ActualCategorie = works[i].category.name
        categoriesSet.add(ActualCategorie);
    }

    // Ajouter l'élément parent
    const parentElement = document.createElement('div');
    parentElement.classList.add('categories-container');

    // Créer les boutons
    const worksData = [...works];
    categoriesSet.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('filter-button');
        if (category === 'Tous') {
            button.classList.add('selected');
        }
        button.addEventListener('click', () => {
            //mettre la classe 'selected' sur le boutton cliqué
            const buttons = document.querySelectorAll('.filter-button');
            buttons.forEach(btn => {
                btn.classList.remove('selected');
            });

            // Ajouter la classe 'selected' uniquement au bouton cliqué
            button.classList.add('selected');
            
            //filtrer les elements
            let worksFiltered;
            if (category === 'Tous') {
                worksFiltered = worksData;
            } else {
                worksFiltered = worksData.filter(work => work.category.name === category);
            }
            document.querySelector(".gallery").innerHTML = "";
            genererWork(worksFiltered);
        });
        parentElement.appendChild(button);
    });

    // Afficher les boutons
    const project_header = document.getElementById('project_header');
    project_header.insertAdjacentElement('afterend', parentElement);
}

export function showImageModal(works) {    
    // Créer un élément de modal
    var modal = document.createElement('div');
    modal.classList.add('image-modal');
    
    // Créer un boutton pour fermer le modal
    var closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.classList.add('modal-close-button');
    closeButton.onclick = function() {
        modal.remove();
        overlay.remove();
    };
    modal.appendChild(closeButton);

    // Créer un titre de modal
    var modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal-title');
    modalTitle.innerText = "Galerie photo";
    modal.appendChild(modalTitle);

    // Créer une liste d'images
    var modalImagesList = document.createElement('div');
    modalImagesList.classList.add('modal-images-list');
    // Boucle à travers les images et les ajouter au modal
    for (var i = 0; i < works.length; i++) {
        var imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        var img = document.createElement('img');
        img.src = works[i].imageUrl;
        imageContainer.appendChild(img);

        // Créer un bouton de suppression pour chaque image
        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.onclick = function() {
            // Envoyer une requête de suppression à la base de données
            var imageSrc = this.parentElement.querySelector('img').src;
            deleteImageFromDatabase(imageSrc);
            // Supprimer l'image du DOM
            this.parentElement.remove();
        };
        imageContainer.appendChild(deleteButton);
        modalImagesList.appendChild(imageContainer);
    }
    modal.appendChild(modalImagesList);

    // Créer un boutton pour ajouter un work
    var addPicButton = document.createElement('button');
    addPicButton.innerText = 'Ajouter une photo';
    addPicButton.classList.add('modal-add-button');
    addPicButton.addEventListener('click', () => {
        showAddPhotoModal(works);
    });
    modal.appendChild(addPicButton);

    // Créer un overlay
    var overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    // Ajouter la modale à la fin du corps de la page
    document.body.appendChild(modal);
}

function deleteImageFromDatabase(imageSrc) {
    // Code pour envoyer une requête de suppression à la base de données
    console.log('Image supprimée de la base de données:', imageSrc);
}

function editPageModifications(works) {
    const loginBtn = document.getElementById('login-btn');
    const headerSection = document.getElementById('project_header');

    loginBtn.innerText = 'logout'

    // Créer le bouton "Modifier"
    const editButton = document.createElement('button');
    editButton.textContent = 'modifier';
    editButton.id = 'editButton';
    // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Modifier"
    editButton.addEventListener('click', function() {
        // interfaceEdit();
        showImageModal(works);
        // alert('Implémentez votre logique de modification ici');
    });

    // Insérer le bouton "Modifier" juste après le titre <h2> dans la section "project_header"
    const h2Element = headerSection.querySelector('h2');
    h2Element.parentNode.insertBefore(editButton, h2Element.nextSibling);
}

function isUserLoggedIn() {
    const token = getTokenFromCookie();
    return !!token;
}

function saveTokenToCookie(token) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    document.cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

// Fonction pour récupérer le jeton d'authentification depuis le cookie
function getTokenFromCookie() {
    // Récupérer tous les cookies
    const cookies = document.cookie.split(';');

    // Parcourir les cookies pour trouver le cookie contenant le jeton d'authentification
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        // Vérifier si le cookie commence par "authToken="
        if (cookie.startsWith('authToken=')) {
            // Extraire et retourner le jeton d'authentification
            return cookie.substring('authToken='.length, cookie.length);
        }
    }

    // Retourner null si le cookie n'est pas trouvé
    return null;
}

const loginFormHTML = `
    <div id="loginForm">
        <h2>Login</h2>
        <label for="email">E-mail</label>
        <input type="email" id="IDemail" name="email" required><br>
        <label for="password">Mot de passe</label>
        <input type="password" id="IDpassword" name="password" required><br>
        <button id="loginSubmitBtn" type="button">Se connecter</button>
    </div>
`;

function loginUser(works) {
    const email = document.getElementById('IDemail').value;
    const password = document.getElementById('IDpassword').value;
    // Envoyer une requête POST à l'URL spécifiée
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        saveTokenToCookie(data.token)
        // Gérer la réponse, par exemple, stocker le jeton
        console.log('Token:', getTokenFromCookie());
        // Remmetre la page par défaut
        toggleLoginForm(works);
        editPageModifications(works);
    })
    .catch(error => {
        console.error('Error:', error);
        // Gérer les erreurs ici
    });
}

function toggleLoginForm(works) {
    const mainContent = document.querySelector('main');
    const children = mainContent.children;
    let childrenHidden = false;
    const loginBtn = document.getElementById('login-btn');
    loginBtn.classList.toggle('selected')

    // Vérifie si les enfants de main sont cachés
    for (let i = 0; i < children.length; i++) {
        if (children[i].style.display === 'none') {
            childrenHidden = true;
            break;
        }
    }

    // Si les enfants sont cachés, les affiche et ajoute le formulaire de connexion
    if (childrenHidden) {
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = '';
        }
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.remove();
        }
    } else { // Sinon, cache les enfants et supprime le formulaire de connexion
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = 'none';
        }
        mainContent.insertAdjacentHTML('beforeend', loginFormHTML);
        document.getElementById('loginSubmitBtn').addEventListener('click', function() {
            loginUser(works);
        });
    }
}


genererWork(works);
genererCategories(works);
eventLogin(works);