const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const notesFilePath = 'db/db.json';

const readNotesFromFile = () => {
  return JSON.parse(fs.readFileSync(notesFilePath, 'utf8'));
};

const writeNotesToFile = (data) => {
  fs.writeFileSync(notesFilePath, JSON.stringify(data));
};

module.exports = (app) => {

  // Enhanced request logging
  app.use((req, res, next) => {
    console.log(`[LOG - ${new Date().toISOString()}] Method: ${req.method} | URL: ${req.url}`);
    next();
  });

  app.get('/api/notes', (req, res) => {
    try {
      const notesData = readNotesFromFile();
      res.json(notesData);
    } catch (error) {
      res.status(503).json({ error: 'Failed to retrieve notes. Please try again later.' });
    }
  });

  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(422).json({ error: 'Both title and text must be provided.' });
    }

    try {
      let notesData = readNotesFromFile();

      const newNote = {
        title,
        text,
        id: uniqid(),
      };

      notesData.push(newNote);
      writeNotesToFile(notesData);
      res.json(newNote);
    } catch (error) {
      res.status(503).json({ error: 'Failed to save the note. Kindly retry.' });
    }
  });

  app.delete('/api/notes/:id', (req, res) => {
    try {
      const notesData = readNotesFromFile();
      const updatedNotes = notesData.filter((note) => note.id !== req.params.id);

      writeNotesToFile(updatedNotes);
      res.json(updatedNotes);
    } catch (error) {
      res.status(503).json({ error: 'Failed to delete the note. Please try again.' });
    }
  });

};
