const express = require('express');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
require('./db');
require('./models/User');
const authRoutes = require('./routes/authRoutes');
const requireToken = require('./Middlewares/AuthTokenRequired');

const port = 3001;
const app = express();

// Using CORS middleware to allow request from localhost
app.use(cors());

app.use(bodyParser.json());
app.use(authRoutes);

app.get('/', requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

// app.post('/signup', (req, res) => {
//   res.send('Someone Signed up');
//   console.log(req.body);
// });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
