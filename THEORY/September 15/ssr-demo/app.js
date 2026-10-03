const express = require('express');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Route that renders home.ejs
app.get('/', (req, res) => {
  res.render('home', { name: 'Aarav' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));