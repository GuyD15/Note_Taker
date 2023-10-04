const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

module.exports = (app) => {
  // logs requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.get('/api/notes', (req, res) => {
    try {
      const db = JSON.parse(fs.readFileSync('db/db.json'));
      res.json(db);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while reading notes.' });
    }
  });

  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text are required fields.' });
    }

    try {
      let db = JSON.parse(fs.readFileSync('db/db.json'));

      const userNote = {
        title,
        text,
        // creates a unique id
        id: uniqid(),
      };

      db.push(userNote);
      fs.writeFileSync('db/db.json', JSON.stringify(db));
      res.json(userNote);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while saving the note.' });
    }
  });

  // deletes notes based on id
  app.delete('/api/notes/:id', (req, res) => {
    try {
      const db = JSON.parse(fs.readFileSync('db/db.json'));
      const deleteNotes = db.filter((item) => item.id !== req.params.id);

      fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
      res.json(deleteNotes);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the note.' });
    }
  });
};
