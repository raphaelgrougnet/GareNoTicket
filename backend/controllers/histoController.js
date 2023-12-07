const Histo = require('../models/historique');
const Facture = require('../models/facture');

exports.getHistorique = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const histo = await Histo
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    if (!histo) {
      const error = new Error('Aucun historique trouvé.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      histo: histo
    });
  } catch (err) {
    next(err);
  }
}

exports.effectuerPaiement = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const histo = await Histo
    .find({ userId: userId, isPaid: false })
    if (!histo) {
      const error = new Error('Aucun historique impayé trouvé.');
      error.statusCode = 404;
      throw error;
    }
    let total = 0;
    for (let historique of histo) {
      historique.isPaid = true;
      total += historique.price;
      await historique.save();
    }
    const newFacture = new Facture({
      userId: userId,
      price: total
    });
    await newFacture.save();
    
    res.status(200).json({
      message: 'Tous les historiques ont été payés.'
    });
  } catch (err) {
    next(err);
  }
}

exports.getFacture = async (req, res, next) => {
  const userId = req.user.userId;
  try {
    const factures = await Facture
    .find({ userId: userId })
    .sort({ createdAt: -1 });
    if (!factures) {
      const error = new Error('Aucune facture trouvée.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      factures: factures
    });
  } catch (err) {
    next(err);
  }
 
}

