const path = require('path');

// Define the paths for the HTML files
const notesHtmlPath = path.join(__dirname, '../public/notes.html');
const indexHtmlPath = path.join(__dirname, '../public/index.html');

module.exports = (app) => {

  // Endpoint to serve the notes.html file
  app.get('/notes', (req, res) => {
    res.sendFile(notesHtmlPath, (err) => {
      if (err) {
        res.status(500).send('Server failed to retrieve the notes page :(');
      }
    });
  });

  // Fallback endpoint to serve the index.html file
  app.get('*', (req, res) => {
    res.sendFile(indexHtmlPath, (err) => {
      if (err) {
        res.status(500).send('Server failed to retrieve the main page :(');
      }
    });
  });

};
