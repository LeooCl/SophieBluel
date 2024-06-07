const projectsUrl = "http://localhost:5678/api/works";
const categoriesUrl = "http://localhost:5678/api/categories";

// Fonction pour récupérer les projets depuis l'API
function fetchProjects(callback) {
  fetch(projectsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données des projets"
        );
      }
      return response.json();
    })
    .then((data) => {
      if (callback) {
        callback(data);
      } else {
        displayProjects(data);
      }
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
}

// Fonction pour récupérer les noms des catégories depuis l'API
function fetchCategories() {
  fetch(categoriesUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données des catégories"
        );
      }
      return response.json();
    })
    .then((data) => {
      createFilterButtons(data);
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
}

function fetchCategoriesModal() {
  fetch(categoriesUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données des catégories"
        );
      }
      return response.json();
    })
    .then((data) => {
      addCategorySelect(data);
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
}

// Fonction pour afficher les projets dans la galerie
function displayProjects(projects) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  projects.forEach((project) => {
    const projectElement = createProjectElement(project);
    gallery.appendChild(projectElement);
  });
}

// Fonction pour créer un élément de projet
function createProjectElement(project, isModal) {
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");

  projectElement.id = `project-${project.id}`;

  const image = document.createElement("img");
  image.src = project.imageUrl;
  image.alt = project.title;
  projectElement.appendChild(image);

  if (!isModal) {
    const caption = document.createElement("p");
    caption.textContent = project.title;
    projectElement.appendChild(caption);
  } else {
    // Ajout du logo de poubelle
    const deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteIcon.classList.add("delete-icon");
    deleteIcon.onclick = function () {
      deleteProject(project.id, projectElement);
    };
    projectElement.appendChild(deleteIcon);
  }

  return projectElement;
}

// Fonction pour créer les boutons de filtrage
function createFilterButtons(categories) {
  const filterButtonsContainer = document.getElementById("filterButtons");

  // Ajout du bouton "Tout Afficher"
  const showAllButton = document.createElement("button");
  showAllButton.textContent = "Tout Afficher";
  showAllButton.classList.add("filter-button");
  showAllButton.classList.add("active-filter");
  showAllButton.addEventListener("click", function () {
    fetchProjects();
    toggleActiveFilter(showAllButton);
  });
  filterButtonsContainer.appendChild(showAllButton);

  // Ajout des boutons de filtre par catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");
    button.addEventListener("click", function () {
      filterProjectsByCategory(category.id);
      toggleActiveFilter(button);
    });
    filterButtonsContainer.appendChild(button);
  });
}

// Fonction pour introduire les catégories dans le formulaire 
function addCategorySelect(categories) {
  const categorySelect = document.getElementById("form-category");

  categorySelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Choisir une catégorie";
  categorySelect.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(categoryId) {
  fetch(projectsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données des projets"
        );
      }
      return response.json();
    })
    .then((data) => {
      const filteredProjects = data.filter(
        (project) => project.categoryId === categoryId
      );
      displayProjects(filteredProjects);
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
}

// Fonction pour activer ou désactiver la classe 'active-filter'
function toggleActiveFilter(activeButton) {
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    if (button === activeButton) {
      button.classList.add("active-filter");
    } else {
      button.classList.remove("active-filter");
    }
  });
}

// Appel des fonctions pour récupérer les projets
fetchProjects();

// Fonction pour déconnecter l'utilisateur
function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  location.reload();
}

// Fonction pour ajouter les éléments du mode édition dans le html
function editionMode() {
  const contentDivEdition = document.body;

  const divEdition = document.createElement("div");
  divEdition.id = "div-edition";
  divEdition.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i>Mode édition</span>`;
  contentDivEdition.prepend(divEdition);
}

// Fonction pour créer et ajouter le bouton pour ouvrir la modale pour la modification des projets
function editButton() {
  const contentEditButton = document.getElementById("titleProjects");

  const divEditButton = document.createElement("button");
  divEditButton.id = "editButton";
  divEditButton.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> modifier</span>`;
  contentEditButton.appendChild(divEditButton);
}

// Changement dynamique de la page quand un utilisateur est connecté
if (
  localStorage.getItem("token") != null &&
  localStorage.getItem("userId") != null
) {
  editionMode();
  editButton();
  const logoutButton = document.getElementById("log");
  logoutButton.textContent = "logout";
  logoutButton.href = "#";
  logoutButton.onclick = function () {
    logoutUser();
  };

  // Ajoute un écouteur d'événement au bouton pour ouvrir la modale
  document.getElementById("editButton").onclick = function () {
    let modal = document.getElementById("myModal") || createModal();
    fetchProjects(displayProjectsModal); // Récupère les projets et les affiche dans la modale
    modal.style.display = "block";
    fetchCategoriesModal();
  };
} else {
  fetchCategories();
}

// Fonction pour créer et afficher la modal pour les modifications des projets
function createModal() {
  let modal = document.createElement("div");
  modal.id = "myModal";
  modal.className = "modal";

  // Modale qui affiche les projets
  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  let closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  let modalHeader = document.createElement("h2");
  modalHeader.textContent = "Galerie photo";

  let modalContentProjects = document.createElement("div");
  modalContentProjects.id = "modalProjectsContainer";

  let addBtnModalContainer = document.createElement("div");
  addBtnModalContainer.className = "add-button-modal-container";

  let addProjectBtnModal = document.createElement("button");
  addProjectBtnModal.id = "add-project-button-modal";
  addProjectBtnModal.innerHTML = "Ajouter une photo";

  // Ajoute les éléments à la modale
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalContentProjects);
  modalContent.appendChild(addBtnModalContainer);
  addBtnModalContainer.appendChild(addProjectBtnModal);
  modal.appendChild(modalContent);

  // Modale pour l'ajout de projet
  let modalAddProjectContent = document.createElement("div");
  modalAddProjectContent.className = "modal-add-project-content";
  modalAddProjectContent.style.display = "none";

  let modalAddProjectIcon = document.createElement("div");
  modalAddProjectIcon.className = "modal-add-project-icon";

  let modalAddProjectIconBack = document.createElement("span");
  modalAddProjectIconBack.className = "back";
  modalAddProjectIconBack.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

  let modalAddProjectIconClose = document.createElement("span");
  modalAddProjectIconClose.className = "close";
  modalAddProjectIconClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  let modalAddProjectHeader = document.createElement("h2");
  modalAddProjectHeader.innerHTML = "Ajout photo";

  let modalAddProjectForm = document.createElement("form");
  modalAddProjectForm.className = "modal-add-project-form";

  let newImg = document.createElement("div");
  newImg.className = "modal-new-image";
  newImg.innerHTML = `<i id= "photo-add-icon" class="fa-regular fa-image"></i>
  <label id="new-image">+ Ajouter photo</label>
  <input id="form-image" type="file" name="image" accept="image/*, .jpg, .jpeg, .png" required>
  <p id="photo-size">jpg, png : 4mo max</p>`;

  let newCategory = document.createElement("div");
  newCategory.className = "modal-new-category";
  newCategory.innerHTML = `<label for="form-title">Titre</label>
  <input type="text" name="title" id="form-title" value="" required>
  <label for="form-category">Catégorie</label>
  <select class="choice-category" id="form-category" required>
    <option value=""></option>
  </select>
  <hr class="border-bottom">
  <input type="submit" id="submit-new-work" value="Valider">`;

  modalAddProjectForm.appendChild(newImg);
  modalAddProjectForm.appendChild(newCategory);
  modalAddProjectIcon.appendChild(modalAddProjectIconBack);
  modalAddProjectIcon.appendChild(modalAddProjectIconClose);
  modalAddProjectContent.appendChild(modalAddProjectIcon);
  modalAddProjectContent.appendChild(modalAddProjectHeader);
  modalAddProjectContent.appendChild(modalAddProjectForm);
  modal.appendChild(modalAddProjectContent);

  document.body.appendChild(modal);

  document.getElementById("submit-new-work").addEventListener("click", function (event) {
    event.preventDefault();
    addProject();
  });

  // Fonction pour fermer la modale/retour en arrière
  closeBtn.onclick = function () {
    modal.style.display = "none";
    modalAddProjectContent.style.display = "none";
    modalContent.style.display = "block";
  };

  modalAddProjectIconBack.onclick = function () {
    modalAddProjectContent.style.display = "none";
    modalContent.style.display = "block";
  };

  modalAddProjectIconClose.onclick = function () {
    modal.style.display = "none";
    modalAddProjectContent.style.display = "none";
    modalContent.style.display = "block";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modalAddProjectContent.style.display = "none";
      modalContent.style.display = "block";
    }
  };

  addProjectBtnModal.onclick = function () {
    modalContent.style.display = "none";
    modalAddProjectContent.style.display = "block";
  };

  return modal;
}

// Fonction pour afficher les projets dans la modale
function displayProjectsModal(projects) {
  const projectsContainer = document.getElementById("modalProjectsContainer");
  projectsContainer.innerHTML = "";

  projects.forEach((project) => {
    const projectElement = createProjectElement(project, true);
    projectsContainer.appendChild(projectElement);
  });
}

// Fonction pour supprimer les projets dans la modale
async function deleteProject(projectId, projectElement) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du projet');
    }

    // Suppression de l'élément du DOM après la suppression réussie du projet
    console.log(`Projet avec l'ID: ${projectId} supprimé`);
    projectElement.remove();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

async function addProject() {
  const title = document.getElementById("form-title").value;
  const category = document.getElementById("form-category").value;
  const imageInput = document.getElementById("form-image");
  const image = imageInput.files[0];
  
  // Validation des données du formulaire
  if (!title || !category || !image) {
    alert("Tous les champs sont requis.");
    return;
  }

  // Créer un objet FormData pour envoyer les données, y compris le fichier image
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du projet');
    }

    // Réinitialiser le formulaire
    document.getElementById("form-title").value = '';
    document.getElementById("form-category").value = '';
    document.getElementById("form-image").value = '';

    // Fermer la modale
    document.getElementById("myModal").style.display = "none";

    // Actualiser la liste des projets
    fetchProjects();
  } catch (error) {
    console.error('Erreur:', error);
  }
}