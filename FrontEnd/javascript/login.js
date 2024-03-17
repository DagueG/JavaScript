function editPageModifications() {
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
        alert('Implémentez votre logique de modification ici');
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
        <button id="loginSubmitBtn" type="button">Login</button>
    </div>
`;

function loginUser() {
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
        toggleLoginForm();
        editPageModifications();
    })
    .catch(error => {
        console.error('Error:', error);
        // Gérer les erreurs ici
    });
}

function toggleLoginForm() {
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
        document.getElementById('loginSubmitBtn').addEventListener('click', loginUser);
    }
}
// Appel de la fonction showLoginModal() lors du clic sur le bouton login
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', () => {
        console.log("lol");
        toggleLoginForm(loginBtn);
    });
});