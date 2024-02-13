let contactsOpen = false;
let categoryOpen = false;
let selectedContacts = [];
let subtasks = [];
let prioity = "medium";
let tasks = [];
let contacts = [];


function checkForms() {
  let checkTitle = document.getElementById("title");
  let checkDate = document.getElementById("date");
  let selectedCategory = document.getElementById("category");

  if (checkTitle.checkValidity()) {
    removeRequiered("title");
    if (checkDate.checkValidity()) {
      removeRequiered("date");
        if (selectedCategory.checkValidity()) {
          removeRequiered("category");
          addTask();
        } else addRequiered("category");
    } else addRequiered("date");
  } else addRequiered("title");
}


async function loadContacts() {
  try {
      const loadedContacts = await getItem('contacts');
      if (loadedContacts.data.value) {
          const contact = JSON.parse(loadedContacts.data.value);
          console.log('Kontakte erfolgreich geladen:', contact);
          contacts.push(contact);
          
      }
      return [];
  } catch (error) {
      console.error('Fehler beim Laden der Kontakte:', error);
      return [];
  }
}

function addRequiered(where) {
  document.getElementById(`${where}_reqiuered`).classList.remove("d-none");
  if (where === "description") {
    document
      .getElementById(`task_${where}`)
      .classList.add(`requiered_${where}`);
  } else document.getElementById(`task_${where}`).classList.add("requiered");
}

function removeRequiered(where) {
  document.getElementById(`${where}_reqiuered`).classList.add("d-none");
  if (where === "description") {
    document
      .getElementById(`task_${where}`)
      .classList.remove(`requiered_${where}`);
  } else document.getElementById(`task_${where}`).classList.remove("requiered");
}

function clearForm() {
  document.getElementById("task_title").value = "";
  document.getElementById("task_description").value = "";
  changePrio("medium");
  document.getElementById("task_contacts").value = "";
  document.getElementById("task_category").value = "";
  document.getElementById("task_subtask").value = "";
}

function changeTextColor() {
  let dateInput = document.getElementById("task_date");
  let selectedDate = dateInput.value;

  if (selectedDate !== "") {
    dateInput.style.color = "black";
  } else {
    dateInput.style.color = "rgba(209, 209, 209, 1)";
  }
}

function changePrio(prio) {
  clearPrio();
  prioity = prio;
  let selectedPrio = document.getElementById(`${prio}`);
  selectedPrio.classList.add(`${prio}`);
  selectedPrio.classList.remove(`hover_${prio}`);
  document.getElementById(`${prio}_svg`).style.fill = "white";
}

function clearPrio() {
  let urgent = document.getElementById("urgent");
  urgent.classList.remove("urgent");
  urgent.classList.add("hover_urgent");
  document.getElementById(`urgent_svg`).style.fill = "#FF3D00";
  let medium = document.getElementById("medium");
  medium.classList.remove("medium");
  medium.classList.add("hover_medium");
  document.getElementById(`medium_svg`).style.fill = "#FFA800";
  let low = document.getElementById("low");
  low.classList.remove("low");
  low.classList.add("hover_low");
  document.getElementById(`low_svg`).style.fill = "#7AE229";
  prioity = 'medium';
}

function toggleContDrop() {
  let inputField = document.getElementById("task_contacts");
  let contactsContainer = document.getElementById("dropdown_contacts");
  if (contactsOpen) {
    closeContacts(contactsContainer);
    inputField.blur();
  } else {
    openContacts(contactsContainer);
  }
}

function openContacts(contactsContainer) {
  contactsContainer.classList.remove("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Search contacts");
  contactsOpen = true;
  contactsContainer.innerHTML = "";

  const contactsArray = contacts[0]; 

  for (let index = 0; index < contactsArray.length; index++) {
    const contact = contactsArray[index];
    let initials = getInitials(contact);
    contactsContainer.innerHTML += renderDropdownContacts(contact, initials, index);
  }
}


function getInitials(contact){
  let namesSplit = contact.name.split(" ")
  let firstName = namesSplit[0].charAt(0);
    let lastName = namesSplit[1].charAt(0);
    return(firstName + lastName)
}

function contactSelectToggle(i) {
  let img = document.getElementById(`contactSelect(${i})`);
  let notSelectedImg = "/assets/add_task/not_selected.png";
  let selectedImg = "/assets/add_task/selected.png";

  // Prüfen, ob der Kontakt bereits ausgewählt ist
  const isSelected = selectedContacts.some(contact => contact.id === contacts[0][i].id);

  if (!isSelected) {
    // Kontakt ist nicht ausgewählt, füge ihn dem Array hinzu
    selectedContacts.push(contacts[0][i]);
    img.src = selectedImg; // Ändere das Bild, da der Kontakt jetzt ausgewählt ist
  } else {
    // Kontakt ist bereits ausgewählt, entferne ihn aus dem Array
    selectedContacts = selectedContacts.filter(contact => contact.id !== contacts[0][i].id);
    img.src = notSelectedImg; // Ändere das Bild, da der Kontakt jetzt nicht mehr ausgewählt ist
  }
}




function closeContacts(contactsContainer) {
  contactsContainer.classList.add("d-none");
  document
    .getElementById("task_contacts")
    .setAttribute("placeholder", "Select contacts to assign");
  contactsOpen = false;
}


function toggleCatDrop() {
  let inputField = document.getElementById("task_category");
  let categoryContainer = document.getElementById("dropdown_category");
  if (categoryOpen) {
    closeCategory(categoryContainer);
    inputField.blur();
  } else {
    openCategory(categoryContainer);
  }
}

function openCategory(categoryContainer) {
  categoryContainer.classList.remove("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Search category");
  categoryOpen = true;
}

function closeCategory(categoryContainer) {
  categoryContainer.classList.add("d-none");
  document
    .getElementById("task_category")
    .setAttribute("placeholder", "Select task category");
  categoryOpen = false;
}

function selectCategory(category){
document.getElementById('task_category').value = category;
toggleCatDrop();
}

function toggleSubDrop() {
  let inputField = document.getElementById("task_subtask");
  if (document.activeElement === inputField) {
    document.getElementById("subtask_confirm_cancel").style.display = "flex";
  }
}

function addSubtask() {
  let text = document.getElementById("task_subtask");
  let title = document.getElementById("task_title");
      let subtask = {
        "title": title.value,
        "text": text.value,
      };
      subtasks.push(subtask);
      text.value = "";
      removeRequiered("title");
      document.getElementById("subtask_confirm_cancel").style.display = "none";
      renderSubtask();
    };

function removeSubInput(){
 document.getElementById("task_subtask").value = '';
 document.getElementById("subtask_confirm_cancel").style.display = "none"
}

function addTask(){
  let description = document.getElementById('task_description').value
  let title = document.getElementById('task_title').value
  let date = document.getElementById('task_date').value
  let category = document.getElementById('task_category').value
  if(description === ""){description = 'Keine Beschreibung'}
  let task = {
    'title': title,
    'description': description,
    'date': date,
    'priority': prioity,
    'contacts': selectedContacts,
    'category': category,
    'subtask': subtasks,
    'position': 'todo',
  }
  tasks.push(task);
  saveTasks();

}

function deleteSubtask(index) {
  if (index >= 0 && index < subtasks.length) {
    subtasks.splice(index, 1); // Entferne den Subtask an der angegebenen Position
    renderSubtask(); // Aktualisiere die Anzeige der Subtasks
  }
}

function editSubtask(index) {
  const subtask = subtasks[index];

  // Setze die Werte des Subtasks in die Inputfelder
  document.getElementById("task_title").value = subtask.title;
  document.getElementById("task_subtask").value = subtask.text;
}



function renderDropdownContacts(contact, initials, i) {
  const isSelected = selectedContacts.some(selectedContact => selectedContact.id === contact.id);
  const imgSrc = isSelected ? "/assets/add_task/selected.png" : "/assets/add_task/not_selected.png";
  return `<div class="dropdown_contact">
                <div class="contact_name">
                  <svg width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
                    <!-- Äußerer Kreis -->
                    <circle cx="21px" cy="21px" r="20px" stroke="white" stroke-width="3" fill="transparent" />
                    <!-- Innerer Kreis -->
                    <circle cx="21px" cy="21px" r="19px" fill="${contact.color}" />
                    <text fill="white" x="21px" y="23px"  alignment-baseline="middle" text-anchor="middle" >
                        ${initials}
                      </text>
                  </svg>
                  <span>${contact.name}</span>
                </div>
                <img id="contactSelect(${i})" onclick="contactSelectToggle(${i})" src="${imgSrc}">
              </div>`;
}



function renderSubtask() {
  const subtasksContainer = document.getElementById("sub");

  // Leere das Container-Element, um es neu zu füllen
  subtasksContainer.innerHTML = "";

  // Iteriere durch die Subtasks und füge sie dem Container hinzu
  subtasks.forEach((subtask, index) => {
    const subtaskElement = createSubtaskElement(subtask, index);
    subtasksContainer.appendChild(subtaskElement);
  });
}

function createSubtaskElement(subtask, index) {
  // Erstelle ein neues HTML-Element für den Subtask
  const subtaskElement = document.createElement("div");
  subtaskElement.classList.add("subtask");

  // Füge den Titel und Text des Subtasks hinzu
  subtaskElement.innerHTML = `
    <div class="subtask-title">${subtask.title}</div>
    <div class="subtask-text">${subtask.text}</div>
    <div class="subtask-actions">
      <button onclick="editSubtask(${index})">Editieren</button>
      <button onclick="deleteSubtask(${index})">Löschen</button>
    </div>
  `;

  return subtaskElement;
}

  async function saveTasks() {
    console.log(tasks);
    try {
        await setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Saving error:', error);
    }
  }

  async function loadTasks() {
    try {
        const loadedTasks = await getItem('tasks');
        console.log(loadedTasks);
        if (loadedTasks.data.value) {
          console.log(loadedTasks);
            tasks = JSON.parse(loadedTasks.data.value);
            console.log(tasks);
            console.log('tasks loaded successfully.');
        }
    } catch (error) {
        console.error('Loading error:', error);
    }}
