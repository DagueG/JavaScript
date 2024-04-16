import { showAddPhotoModal } from './photo_add.js'

export async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    localStorage.setItem("works", JSON.stringify(works));
    return works;
}

function eventLogin(works) {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', () => {
        if (loginBtn.innerText === 'login') {
            toggleLoginForm(works);
        } else {
            loginBtn.innerText = 'login'
            const editButton = document.querySelector('#editButton');
            editButton.remove();
        }
    });    
}

function genererWork(works) {
    const sectionFiches = document.querySelector(".gallery");
    sectionFiches.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const article = works[i];
        const worksElements = document.createElement("figure");
        const imageElements = document.createElement("img");
        const figcaptionElements = document.createElement("figcaption")
        imageElements.src = article.imageUrl;
        worksElements.dataset.id = article.id;
        imageElements.alt = article.title;
        figcaptionElements.innerText = article.title;
        sectionFiches.appendChild(worksElements);
        worksElements.appendChild(imageElements);
        worksElements.appendChild(figcaptionElements);
    }
}

function genererCategories(works) {
    const categoriesSet = new Set();
    categoriesSet.add('Tous');
    for (let i = 0; i < works.length; i++) {
        const ActualCategorie = works[i].category.name
        categoriesSet.add(ActualCategorie);
    }

    const parentElement = document.createElement('div');
    parentElement.classList.add('categories-container');

    const worksData = [...works];
    categoriesSet.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('filter-button');
        if (category === 'Tous') {
            button.classList.add('selected');
        }
        button.addEventListener('click', () => {
            const buttons = document.querySelectorAll('.filter-button');
            buttons.forEach(btn => {
                btn.classList.remove('selected');
            });

            button.classList.add('selected');
            
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

    const project_header = document.getElementById('project_header');
    project_header.insertAdjacentElement('afterend', parentElement);
}

export async function showImageModal(works) {    
    var modal = document.createElement('div');
    modal.classList.add('image-modal');
    
    var closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.classList.add('modal-close-button');
    closeButton.onclick = function() {
        modal.remove();
        overlay.remove();
    };
    modal.appendChild(closeButton);

    var modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal-title');
    modalTitle.innerText = "Galerie photo";
    modal.appendChild(modalTitle);

    var modalImagesList = document.createElement('div');
    modalImagesList.classList.add('modal-images-list');
    for (var i = 0; i < works.length; i++) {
        var imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.dataset.id = works[i].id;
        var img = document.createElement('img');
        img.src = works[i].imageUrl;
        imageContainer.appendChild(img);

        var deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.onclick = async function(event) {
            event.preventDefault();
            var worksID = this.parentElement.dataset.id;
            await deleteImageFromDatabase(worksID);
            const works = await fetchWorks();
            modal.remove();
            overlay.remove();
            showImageModal(works);
        };
        imageContainer.appendChild(deleteButton);
        modalImagesList.appendChild(imageContainer);
    }
    modal.appendChild(modalImagesList);

    var addPicButton = document.createElement('button');
    addPicButton.innerText = 'Ajouter une photo';
    addPicButton.classList.add('modal-add-button');
    addPicButton.addEventListener('click', () => {
        showAddPhotoModal(works);
    });
    modal.appendChild(addPicButton);

    var overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    document.body.appendChild(modal);
}

async function deleteImageFromDatabase(worksID) {
    const token = getTokenFromCookie();
    await fetch('http://localhost:5678/api/works/' + worksID, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}

function editPageModifications(works) {
    const loginBtn = document.getElementById('login-btn');
    const headerSection = document.getElementById('project_header');

    loginBtn.innerText = 'logout'

    const editButton = document.createElement('button');
    editButton.textContent = 'modifier';
    editButton.id = 'editButton';
    editButton.addEventListener('click', function() {
        showImageModal(works);
    });

    const h2Element = headerSection.querySelector('h2');
    h2Element.parentNode.insertBefore(editButton, h2Element.nextSibling);
}

function isUserLoggedIn() {
    const token = getTokenFromCookie();
    if (token) {
        console.log("found token.")
        editPageModifications(works);
    } else {
        console.log("No token provided.");
    }
}

function saveTokenToCookie(token) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    document.cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
}

export function getTokenFromCookie() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith('authToken=')) {
            return cookie.substring('authToken='.length, cookie.length);
        }
    }
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
        <a id="forgotPasswordBtn" href="#">Mot de passe oublié</a>
    </div>
`;

async function loginUser(works) {
    const email = document.getElementById('IDemail').value;
    const password = document.getElementById('IDpassword').value;
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();
        saveTokenToCookie(data.token);
        toggleLoginForm(true);
        editPageModifications(true);
    } catch (error) {
        alert('Oups! It seems like the login/password combination did not work, try again.');
    }
}

function toggleLoginForm(works) {
    const mainContent = document.querySelector('main');
    const children = mainContent.children;
    let childrenHidden = false;
    const loginBtn = document.getElementById('login-btn');
    loginBtn.classList.toggle('selected')

    for (let i = 0; i < children.length; i++) {
        if (children[i].style.display === 'none') {
            childrenHidden = true;
            break;
        }
    }

    if (childrenHidden) {
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = '';
        }
        const loginForm = document.getElementById('loginForm');
        loginForm.remove();
    } else {
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = 'none';
        }
        mainContent.insertAdjacentHTML('beforeend', loginFormHTML);
        document.getElementById('loginSubmitBtn').addEventListener('click', function() {
            loginUser(works);
        });
    }
}

fetchWorks().then(works => {
    genererWork(works);
    genererCategories(works);
    eventLogin(works);
    isUserLoggedIn();
})
