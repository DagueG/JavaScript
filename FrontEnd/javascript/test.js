const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

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

    const categoriesSet = new Set();
    for (let i = 0; i < works.length; i++) {
        const ActualCategorie = works[i].category.name
        categoriesSet.add(ActualCategorie);
    }

    const parentElement = document.createElement('div');

    // Ajouter une classe à l'élément parent pour le style CSS
    parentElement.classList.add('categories-container');

    // Parcourir chaque catégorie et créer un bouton pour chaque catégorie
    categoriesSet.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('filter-button');
        button.addEventListener('click', (works) => {
            console.log('Catégorie sélectionnée:', category);
            return (work => work.category.name === categorieSelectionnee)
        });
        parentElement.appendChild(button);
    });

    // Sélectionner l'élément où vous souhaitez ajouter le parent
    const h2Element = document.getElementById('portfolio').querySelector('h2');

    // Insérer l'élément parent juste après l'élément <h2>
    h2Element.insertAdjacentElement('afterend', parentElement);
}

genererWork(works);
genererCategories(works);