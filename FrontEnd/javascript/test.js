const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

function genererWork(works) {

    const article = works[0];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".test_class");
    // Création d’une balise dédiée à une pièce automobile
    const worksElements = document.createElement("article");
    worksElements.dataset.id = article.id;
    worksElements.dataset.title = article.title;
    const imageElements = document.createElement("img");
    imageElements.src = article.imageUrl;
    sectionFiches.appendChild(worksElements);
    worksElements.appendChild(imageElements);

}
genererWork(works);