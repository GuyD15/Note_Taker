const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('../Develop/routes/api-routes')(app);
require('../Develop/routes/home-routes')(app);

app.listen(PORT, () => {
  console.log(`Server available at http://localhost:${PORT}`);
});