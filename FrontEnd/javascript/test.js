const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

function genererWork(works) {

    for (let i = 0; i < works.length; i++) {

    const article = works[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".gallery");
    // Création d’une balise dédiée à une pièce automobile
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
genererWork(works);