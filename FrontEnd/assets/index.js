const projectsUrl = "http://localhost:5678/api/works";
const categoriesUrl = "http://localhost:5678/api/categories";


// Fonction pour récupérer les projets depuis l'API
function fetchProjects() {
  fetch(projectsUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données des projets');
      }
      return response.json();
    })
    .then(data => {
      displayProjects(data);
    })
    .catch(error => {
      console.error('Erreur :', error);
    });
}

// Fonction pour récupérer les noms des catégories depuis l'API
function fetchCategories() {
  fetch(categoriesUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données des catégories');
      }
      return response.json();
    })
    .then(data => {
      createFilterButtons(data);
    })
    .catch(error => {
      console.error('Erreur :', error);
    });
}

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  
  projects.forEach(project => {
    const projectElement = createProjectElement(project);
    gallery.appendChild(projectElement);
  });
}

// Fonction pour créer un élément de projet
function createProjectElement(project) {
  const projectElement = document.createElement('div');
  projectElement.classList.add('project');

  const image = document.createElement('img');
  image.src = project.imageUrl;
  image.alt = project.title;
  projectElement.appendChild(image);

  const caption = document.createElement('p');
  caption.textContent = project.title;
  projectElement.appendChild(caption);

  return projectElement;
}

// Fonction pour créer les boutons de filtrage
function createFilterButtons(categories) {
  const filterButtonsContainer = document.getElementById('filterButtons');

  // Ajout du bouton "Tout Afficher"
  const showAllButton = document.createElement('button');
  showAllButton.textContent = 'Tout Afficher';
  showAllButton.classList.add('filter-button');
  showAllButton.classList.add('active-filter');
  showAllButton.addEventListener('click', function() {
    fetchProjects();
    toggleActiveFilter(showAllButton);
  });
  filterButtonsContainer.appendChild(showAllButton);

  // Ajout des boutons de filtre par catégorie
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.classList.add('filter-button');
    button.addEventListener('click', function() {
      const categoryId = category.id;
      filterProjectsByCategory(categoryId);
      toggleActiveFilter(button);
    });
    filterButtonsContainer.appendChild(button);
  });
}

// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(categoryId) {
  fetch(projectsUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données des projets');
      }
      return response.json();
    })
    .then(data => {
      const filteredProjects = data.filter(project => project.categoryId === categoryId);
      displayProjects(filteredProjects);
    })
    .catch(error => {
      console.error('Erreur :', error);
    });
}


// Fonction pour activer ou désactiver la classe 'active-filter'
function toggleActiveFilter(activeButton) {
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    if (button === activeButton) {
      button.classList.add('active-filter');
    } else {
      button.classList.remove('active-filter');
    }
  });
}

// Appel des fonctions pour récupérer les projets et les catégories au chargement de la page
fetchProjects();
fetchCategories();