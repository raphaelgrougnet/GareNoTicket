const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const is_Auth = require('../middleware/is-auth');

// /user/ => GET
router.get('/users/', usersController.getUsers);

// L'utilisateur actuellement connecté /user/ (profil utilisateur)
router.get('/user/', is_Auth, usersController.getUser);

// un utilisateur avec son id /user/:id
router.get('/user/:id', usersController.getUserById);

// Mise à jour d'un utilisateur
router.put('/user/:userId', is_Auth, usersController.updateUser);

// Suppression de l'utilisateur actuellement connecté
router.delete('/user/', is_Auth, usersController.deleteUser);

// Mise à jour d'une voiture
router.put('/car/:userId', is_Auth, usersController.updateCar);

module.exports = router;

