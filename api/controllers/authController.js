const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect!' });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            const token = jwt.sign(
              { email: user.email, isValet : user.isValet, price : user.price, voiture: user.voiture, userId: user._id },
              process.env.SECRET_JWT,
              { expiresIn: '1h' }
            );
            res.status(200).json({ token: token });
          } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect!' });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Une erreur s\'est produite!' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Une erreur s\'est produite!' });
    });

};

exports.signup = async (req, res, next) => {
  const { email, username, password } = req.body;
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        return res.status(401).json({ message: 'Utilisateur déjà existant!' });
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email,
            username,
            password: hashedPassword,
            isValet: false,
            price: 0
          });
          return user.save();
        })
        .then(result => {
          res.status(201).json({ message: 'Utilisateur créé!', userId: result._id });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Une erreur s\'est produite!' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Une erreur s\'est produite!' });
    });

};

