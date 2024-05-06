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
    const user = await checkUserExists(userId);
    res.status(200).json({
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await checkUserExists(userId);
    const updatedUser = req.body.user;
    if (!user) {
      const error = new Error('L\'utilisateur n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    user.username = updatedUser.username || user.username;
    user.email = updatedUser.email || user.email;
    if (!user.voiture && updatedUser.voiture){
      const voiture = new Voiture({
        marque: updatedUser.voiture.marque || "",
        modele: updatedUser.voiture.modele || "",
        couleur: updatedUser.voiture.couleur || "",
        plaque: updatedUser.voiture.plaque || "",
        valet : "655380365f376fe7e3043243",
        latitude: 0,
        longitude: 0,
        isParked: false,
        isMoving: false,
      });
      await voiture.save();
      user.voiture = voiture._id;
    }
    else if (user.voiture && updatedUser.voiture) {
      const voiture = await Voiture.findById(user.voiture);
      voiture.marque = updatedUser.voiture.marque || voiture.marque;
      voiture.modele = updatedUser.voiture.modele || voiture.modele;
      voiture.couleur = updatedUser.voiture.couleur || voiture.couleur;
      voiture.plaque = updatedUser.voiture.plaque || voiture.plaque;
      await voiture.save();
    }
    await user.save();
    const token = jwt.sign(
        { email: user.email, isValet : user.isValet, price : user.price, voiture: user.voiture, userId: user._id },
        process.env.SECRET_JWT,
        { expiresIn: '24h' }
    );
    res.status(200).json({ updatedUserJWT: token });
  } catch (err) {
    next(err);
  }
}

exports.updateCar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const id = req.params.userId;
    const user = await checkUserExists(id);
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
      console.log(day, hour, min);
      if ((day >= 1 && day <= 5) && ((hour >= 9 && hour < 12) || (hour >= 13 && min <= 30 && hour < 17))) {
        console.log("Est en semaine et entre 9h et 12h ou entre 13h30 et 17h")
        car['timeToLeave'] = date.setMinutes(date.getMinutes() + 60);
        if (car['timeToLeave'].hour >= 12 && (car['timeToLeave'].hour < 13 || car['timeToLeave'].hour >= 13 && car['timeToLeave'].min <= 30)) {
          console.log("Le temps de départ est entre midi et 13h30 donc on le met à 14h30")
          date.setHours(14);
          date.setMinutes(30);
          car['timeToLeave'] = date;
        }
        else if (hour >= 12 && (hour < 13 || hour == 13 && min <= 30)) {
          console.log("Est en semaine mais dans les horaires de midi")
          date.setHours(14);
          date.setMinutes(30);
          car['timeToLeave'] = date;
        }
        else if (car['timeToLeave'].hour >= 17) {
          console.log("Est en semaine mais après 17h")
          date.setdate(date.getDate() + 1);
          date.setHours(10);
          date.setMinutes(0);
          if (date.getDay() == 6 || date.getDay() == 0) {
            console.log("Est un samedi ou un dimanche")
            const nextMonday = date.getDate() + (1 + 7 - date.getDay()) % 7;
            date.setDate(nextMonday);
          }
          car['timeToLeave'] = date;
        }
      }
      else {
        console.log("Est un samedi ou un dimanche")
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
    await user.deleteOne();
    if (user.voiture) {
      const voiture = await Voiture.findById(user.voiture);
      await voiture.deleteOne();
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