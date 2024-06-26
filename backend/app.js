const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const historiqueRoutes = require('./routes/historique');
const dbRoutes = require('./routes/db');
const config = require('./config');

const app = express();
const PORT = config.PORT;
const MONGO_URL = config.MONGO_URL

const cors = require('cors');



// parse application/json
app.use(express.json());  

// remplace le res.json standard avec la nouvelle version
// qui prend en charge les liens HATEOAS
app.use(hateoasLinker); 


app.use(cors());


// Utilisation des routes en tant que middleware
app.use('/auth', authRoutes);
app.use(userRoutes);
app.use(historiqueRoutes);
app.use(dbRoutes);






mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log('Node.js est à l\'écoute sur le port %s ', PORT);
    });
  })
  .catch(err => console.log(err));


module.exports = app;