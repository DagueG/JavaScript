// URL de l'API Swagger

// Récupération des pièces depuis l'API
const reponse = await fetch('http://localhost:5678/api/users');
let users = await reponse.json();
const valeurusers = JSON.stringify(users);
