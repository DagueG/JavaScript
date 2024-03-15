const loginFormHTML = `
    <div id="loginForm">
        <h2>Login</h2>
        <label for="email">Email:</label>
        <input type="email" id="IDemail" name="email" required><br>
        <label for="password">Password:</label>
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
        // Gérer la réponse, par exemple, stocker le jeton
        console.log('Token:', data.token);
        // Vous pouvez effectuer d'autres actions en fonction de la réponse ici
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
        loginBtn.classList.toggle('selected')
        toggleLoginForm();
    });
});