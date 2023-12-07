const express = require('express');
const dbController = require('../controllers/dbController');

const router = express.Router();

router.get('/db/seed', dbController.seedDatabase);

module.exports = router;