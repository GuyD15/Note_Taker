const path = require('path');

// Define the paths for the HTML files
const notesPath = path.join(__dirname, '../public/notes.html');
const indexPath = path.join(__dirname, '../public/index.html');

module.exports = (app) => {

  // Fallback endpoint to serve the index.html file
  app.get('*', (req, res) => {
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(500).send('Server failed to retrieve the main page :(');
      }
    });
  });

  // Endpoint to serve the notes.html file
  app.get('/notes', (req, res) => {
    res.sendFile(notesPath, (err) => {
      if (err) {
        res.status(500).send('Server failed to retrieve the notes page :(');
      }
    });
  });
};
