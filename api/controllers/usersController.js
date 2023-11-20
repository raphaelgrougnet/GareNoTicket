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
    if (updatedCar['isParked']) {
      const date = new Date();
      const day = date.getDay();
      const hour = date.getHours();
      const min = date.getMinutes();
      if ((day >= 1 && day <= 5) && ((hour >= 9 && hour < 12) || (hour >= 13 && min >= 30 && hour < 17))) {
        car['timeToLeave'] = date.setMinutes(date.getMinutes() + 60);
        if (car['timeToLeave'].hour >= 12 && car['timeToLeave'].hour < 13.5) {
          date.setHours(14);
          date.setMinutes(30);
          car['timeToLeave'] = date;
        }
        else if (car['timeToLeave'].hour >= 17) {
          date.setdate(date.getDate() + 1);
          date.setHours(9);
          date.setMinutes(0);
          car['timeToLeave'] = date;
        }
      }
      else{
        const nextMonday = date.getDate() + (1 + 7 - date.getDay()) % 7;
        date.setDate(nextMonday);
        date.setHours(10);
        date.setMinutes(0);
        date.setSeconds(0);
        car['timeToLeave'] = date;
      }
    }
    Object.keys(updatedCar).forEach(key => {
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