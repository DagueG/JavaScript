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
    const h2Element = document.getElementById('portfolio').querySelector('h2');
    h2Element.insertAdjacentElement('afterend', parentElement);
}

genererWork(works);
genererCategories(works);