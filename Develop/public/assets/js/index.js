let titleOfNote;
let textOfNote;
let buttonSave;
let buttonNew;
let listOfNotes;

if (window.location.pathname === '/notes') {
  titleOfNote = document.querySelector('.note-title');
  textOfNote = document.querySelector('.note-textarea');
  buttonSave = document.querySelector('.save-note');
  buttonNew = document.querySelector('.new-note');
  listOfNotes = document.querySelectorAll('.list-container .list-group');
}

const displayElement = (element) => {
  element.style.display = 'inline';
};

const hideElement = (element) => {
  element.style.display = 'none';
};

let currentNote = {};

const fetchNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const storeNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const removeNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const displayCurrentNote = () => {
  hideElement(buttonSave);

  if (currentNote.id) {
    titleOfNote.setAttribute('readonly', true);
    textOfNote.setAttribute('readonly', true);
    titleOfNote.value = currentNote.title;
    textOfNote.value = currentNote.text;
  } else {
    titleOfNote.removeAttribute('readonly');
    textOfNote.removeAttribute('readonly');
    titleOfNote.value = '';
    textOfNote.value = '';
  }
};

const onNoteSave = () => {
  const newEntry = {
    title: titleOfNote.value,
    text: textOfNote.value,
  };
  storeNote(newEntry).then(() => {
    getAndShowNotes();
    displayCurrentNote();
  });
};

const onNoteDelete = (event) => {
  event.stopPropagation();
  const selectedNote = event.target;
  const selectedNoteId = JSON.parse(selectedNote.parentElement.getAttribute('data-note')).id;

  if (currentNote.id === selectedNoteId) {
    currentNote = {};
  }

  removeNote(selectedNoteId).then(() => {
    getAndShowNotes();
    displayCurrentNote();
  });
};

const onViewNote = (event) => {
  event.preventDefault();
  currentNote = JSON.parse(event.target.parentElement.getAttribute('data-note'));
  displayCurrentNote();
};

const onNewNote = () => {
  currentNote = {};
  displayCurrentNote();
};

const displaySaveButton = () => {
  if (!titleOfNote.value.trim() || !textOfNote.value.trim()) {
    hideElement(buttonSave);
  } else {
    displayElement(buttonSave);
  }
};

const displayNoteTitles = async (notes) => {
  let parsedNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    listOfNotes.forEach((el) => (el.innerHTML = ''));
  }

  let itemsOfList = [];

  const generateLi = (text, delBtn = true) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item');

    const spanElement = document.createElement('span');
    spanElement.classList.add('list-item-title');
    spanElement.innerText = text;
    spanElement.addEventListener('click', onViewNote);

    liElement.append(spanElement);

    if (delBtn) {
      const deleteButton = document.createElement('i');
      deleteButton.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      deleteButton.addEventListener('click', onNoteDelete);

      liElement.append(deleteButton);
    }

    return liElement;
  };

  if (parsedNotes.length === 0) {
    itemsOfList.push(generateLi('No saved Notes', false));
  }

  parsedNotes.forEach((note) => {
    const li = generateLi(note.title);
    li.dataset.note = JSON.stringify(note);

    itemsOfList.push(li);
  });

  if (window.location.pathname === '/notes') {
    itemsOfList.forEach((note) => listOfNotes[0].append(note));
  }
};

const getAndShowNotes = () => fetchNotes().then(displayNoteTitles);

if (window.location.pathname === '/notes') {
  buttonSave.addEventListener('click', onNoteSave);
  buttonNew.addEventListener('click', onNewNote);
  titleOfNote.addEventListener('keyup', displaySaveButton);
  textOfNote.addEventListener('keyup', displaySaveButton);
}

getAndShowNotes();
