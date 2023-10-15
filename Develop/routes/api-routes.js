const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const notesPath = path.join(__dirname, '../db/db.json');

const getNotes = () => {
  return JSON.parse(fs.readFileSync(notesPath, 'utf8'));
};

const writeNotesToFile = (data) => {
  fs.writeFileSync(notesPath, JSON.stringify(data));
};

module.exports = (app) => {

  app.get('/api/notes', (req, res) => {
    try {
      const notesData = getNotes();
      res.json(notesData);
    } catch (error) {
      res.status(503).json({ error: 'Could not get notes.' });
    }
  });
  // deletes notes
  app.delete('/api/notes/:id', (req, res) => {
    try {
      const notesData = getNotes();
      const updatedNotes = notesData.filter((note) => note.id !== req.params.id);

      writeNotesToFile(updatedNotes);
      res.json(updatedNotes);
    } catch (error) {
      res.status(503).json({ error: 'Could not delete note.' });
    }
  });
  // Saves the notes that are inserted in the note taker
  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(422).json({ error: 'Both title and text can not be null.' });
    }

    try {
      let notesData = getNotes();

      const newNote = {
        title,
        text,
        id: uniqid(),
      };

      notesData.push(newNote);
      writeNotesToFile(notesData);
      res.json(newNote);
    } catch (error) {
      res.status(503).json({ error: 'Could not save note' });
    }
  });
}