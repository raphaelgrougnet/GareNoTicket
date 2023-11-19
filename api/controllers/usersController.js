const User = require('../models/user');
const Voiture = require('../models/voiture');
const Histo = require('../models/historique');
const config = require('../config');
const jwt = require('jsonwebtoken');
const SECRET_JWT = process.env.SECRET_JWT;
const url_base = config.URL + ":" + config.PORT;


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isValet: false }).populate({
      path: 'voiture',
      match: { isParked: true }
    });

    const filteredUsers = users.filter(user => user.voiture != null);
    if (!filteredUsers.length) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      users: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => { }

exports.updateCar = async (req, res, next) => { 
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Non authentifié.');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET_JWT);
    } catch (err) {
      err.statusCode = 401;
      throw err;
    }
    const userId = decodedToken.userId;
    const user = await checkUserExists(userId);
    const updatedCar = req.body;
    const car = user.voiture;
    if (!car) {
      const error = new Error('La voiture n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    Object.keys(updatedCar).forEach(key => {
      console.log(key);
      car[key] = updatedCar[key];
    });
    await car.save();
    res.status(200).json({
      car: car
    });
  } catch (err) {
    next(err);
  }
}



exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    await user.remove();
    if (user.voiture) {
      const voiture = await Voiture.findById(user.voiture);
      await voiture.remove();
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Fonction pour vérifier si un utilisateur existe
async function checkUserExists(userId) {
  const user = await User.findById(userId).populate('voiture');
  if (!user) {
    const error = new Error('L\'utilisateur n\'existe pas.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}