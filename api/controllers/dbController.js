const User = require('../models/user');
const Voiture = require('../models/voiture');
const Historique = require('../models/historique');
const Facture = require('../models/facture');


const users = [
  {
    "_id": "655385535f376fe7e3043276",
    "email": "user1@gare.ca",
    "username": "Raphaël Grougnet",
    "password": "123456",
    "isValet": false,
    "voiture": "655380d25f376fe7e3043248"
  },
  {
    "_id": "6553856d5f376fe7e3043278",
    "email": "user2@gare.ca",
    "username": "Jean Michel",
    "password": "123456",
    "isValet": false,
    "voiture": "655385dd5f376fe7e304327d"
  },
  {
    "_id": "655387855f376fe7e304329c",
    "email": "user3@gare.ca",
    "username": "Alice Dupont",
    "password": "123456",
    "isValet": false,
    "voiture": "655387e75f376fe7e30432a0"
  },
  {
    "_id": "6553878a5f376fe7e304329d",
    "email": "user4@gare.ca",
    "username": "Bob Martin",
    "password": "123456",
    "isValet": false,
    "voiture": "6553880a5f376fe7e30432a1"
  },
  {
    "_id": "655387935f376fe7e304329e",
    "email": "user5@gare.ca",
    "username": "Eva Rousseau",
    "password": "123456",
    "isValet": false,
    "voiture": "6553882b5f376fe7e30432a2"
  },
  {
    "_id": "655389535f376fe7e30432af",
    "email": "valet@gare.ca",
    "username": "Alfred Pennyworth",
    "password": "123456",
    "isValet": true,
    "price": 2.5
  }
];

const voitures = [
  {
    "_id": "655380d25f376fe7e3043248",
    "marque": "Honda",
    "modele": "Civic",
    "couleur": "Bleue",
    "plaque": "OGFD96",
    "valet": "655380365f376fe7e3043243",
    "isParked": false,
    "isMoving": true,
    "latitude": 1.5,
    "longitude": 1.5,
    "timeToLeave": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
  },
  {
    "_id": "655385dd5f376fe7e304327d",
    "marque": "Mazda",
    "modele": "MX-5",
    "couleur": "Rouge",
    "plaque": "96FYH5",
    "valet": "655380365f376fe7e3043243",
    "isParked": true,
    "isMoving": false,
    "latitude": 1.5,
    "longitude": 1.5,
    "timeToLeave": new Date(new Date().setHours(10,0,0,0)).toISOString()
  },
  {
    "_id": "655387e75f376fe7e30432a0",
    "marque": "Toyota",
    "modele": "Corolla",
    "couleur": "Rouge",
    "plaque": "GE9G5G",
    "valet": "655380365f376fe7e3043244",
    "isParked": true,
    "isMoving": false,
    "latitude": 1.8,
    "longitude": 2,
    "timeToLeave": new Date(new Date().setHours(14,30,0,0)).toISOString()
  },
  {
    "_id": "6553880a5f376fe7e30432a1",
    "marque": "Ford",
    "modele": "Focus",
    "couleur": "Noir",
    "plaque": "XYZ789",
    "valet": "655380365f376fe7e3043245",
    "isParked": true,
    "isMoving": false,
    "latitude": 2.2,
    "longitude": 1.7,
    "timeToLeave": new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9,0,0,0)).toISOString()
  },
  {
    "_id": "6553882b5f376fe7e30432a2",
    "marque": "Chevrolet",
    "modele": "Malibu",
    "couleur": "Verte",
    "plaque": "LM8G56",
    "valet": "655380365f376fe7e3043246",
    "isParked": false,
    "isMoving": false,
    "latitude": 1.5,
    "longitude": 2.5,
    "timeToLeave": new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()
  }
];

const historiques = [
  {
    "_id": "655382355f376fe7e3043254",
    "price": 2.5,
    "isPaid": true,
    "userId": "655385535f376fe7e3043276",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538b415f376fe7e30432b5",
    "price": 2.5,
    "isPaid": true,
    "userId": "655385535f376fe7e3043276",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538b465f376fe7e30432b6",
    "price": 2.5,
    "isPaid": true,
    "userId": "655385535f376fe7e3043276",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538b525f376fe7e30432b7",
    "price": 2.5,
    "isPaid": false,
    "userId": "655385535f376fe7e3043276",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538b555f376fe7e30432b8",
    "price": 2.5,
    "isPaid": false,
    "userId": "655385535f376fe7e3043276",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538b585f376fe7e30432b9",
    "price": 2.5,
    "isPaid": false,
    "userId": "655385535f376fe7e3043276",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538bae5f376fe7e30432c0",
    "price": 2.5,
    "isPaid": true,
    "userId": "6553856d5f376fe7e3043278",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538bb45f376fe7e30432c1",
    "price": 2.5,
    "isPaid": true,
    "userId": "6553856d5f376fe7e3043278",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538bb75f376fe7e30432c2",
    "price": 2.5,
    "isPaid": true,
    "userId": "6553856d5f376fe7e3043278",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538bbd5f376fe7e30432c3",
    "price": 2.5,
    "isPaid": false,
    "userId": "6553856d5f376fe7e3043278",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538bc05f376fe7e30432c4",
    "price": 2.5,
    "isPaid": false,
    "userId": "6553856d5f376fe7e3043278",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538bc25f376fe7e30432c5",
    "price": 2.5,
    "isPaid": false,
    "userId": "6553856d5f376fe7e3043278",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c385f376fe7e30432c8",
    "price": 2.5,
    "isPaid": true,
    "userId": "655387855f376fe7e304329c",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c3b5f376fe7e30432c9",
    "price": 2.5,
    "isPaid": true,
    "userId": "655387855f376fe7e304329c",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c3e5f376fe7e30432ca",
    "price": 2.5,
    "isPaid": true,
    "userId": "655387855f376fe7e304329c",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c445f376fe7e30432cb",
    "price": 2.5,
    "isPaid": false,
    "userId": "655387855f376fe7e304329c",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c485f376fe7e30432cc",
    "price": 2.5,
    "isPaid": false,
    "userId": "655387855f376fe7e304329c",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c4b5f376fe7e30432cd",
    "price": 2.5,
    "isPaid": false,
    "userId": "655387855f376fe7e304329c",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c605f376fe7e30432d0",
    "price": 2.5,
    "isPaid": true,
    "userId": "6553878a5f376fe7e304329d",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c645f376fe7e30432d1",
    "price": 2.5,
    "isPaid": true,
    "userId": "6553878a5f376fe7e304329d",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c675f376fe7e30432d2",
    "price": 2.5,
    "isPaid": true,
    "userId": "6553878a5f376fe7e304329d",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538c725f376fe7e30432d3",
    "price": 2.5,
    "isPaid": false,
    "userId": "6553878a5f376fe7e304329d",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538cff5f376fe7e30432d7",
    "price": 2.5,
    "isPaid": false,
    "userId": "6553878a5f376fe7e304329d",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d405f376fe7e30432d8",
    "price": 2.5,
    "isPaid": false,
    "userId": "6553878a5f376fe7e304329d",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d5d5f376fe7e30432db",
    "price": 2.5,
    "isPaid": true,
    "userId": "655387935f376fe7e304329e",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d635f376fe7e30432dc",
    "price": 2.5,
    "isPaid": true,
    "userId": "655387935f376fe7e304329e",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d675f376fe7e30432dd",
    "price": 2.5,
    "isPaid": true,
    "userId": "655387935f376fe7e304329e",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d6d5f376fe7e30432de",
    "price": 2.5,
    "isPaid": false,
    "userId": "655387935f376fe7e304329e",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d735f376fe7e30432df",
    "price": 2.5,
    "isPaid": false,
    "userId": "655387935f376fe7e304329e",
    "valetId": "655389535f376fe7e30432af"
  },
  {
    "_id": "65538d7a5f376fe7e30432e0",
    "price": 2.5,
    "isPaid": false,
    "userId": "655387935f376fe7e304329e",
    "valetId": "655389535f376fe7e30432af"
  }
];

const factures = [
  {
    "_id": "655386545f376fe7e3043294",
    "price": 2.5,
    "userId": "655385535f376fe7e3043276"
  },
  {
    "_id": "655390365f376fe7e30432f3",
    "price": 2.5,
    "userId": "655385535f376fe7e3043276"
  },
  {
    "_id": "655390385f376fe7e30432f4",
    "price": 2.5,
    "userId": "655385535f376fe7e3043276"
  },
  {
    "_id": "655390455f376fe7e30432f8",
    "price": 2.5,
    "userId": "6553856d5f376fe7e3043278"
  },
  {
    "_id": "655390485f376fe7e30432f9",
    "price": 2.5,
    "userId": "6553856d5f376fe7e3043278"
  },
  {
    "_id": "6553904a5f376fe7e30432fa",
    "price": 2.5,
    "userId": "6553856d5f376fe7e3043278"
  },
  {
    "_id": "655390565f376fe7e30432fd",
    "price": 2.5,
    "userId": "655387855f376fe7e304329c"
  },
  {
    "_id": "6553905a5f376fe7e30432fe",
    "price": 2.5,
    "userId": "655387855f376fe7e304329c"
  },
  {
    "_id": "6553905d5f376fe7e30432ff",
    "price": 2.5,
    "userId": "655387855f376fe7e304329c"
  },
  {
    "_id": "655390735f376fe7e3043303",
    "price": 2.5,
    "userId": "6553878a5f376fe7e304329d"
  },
  {
    "_id": "655390765f376fe7e3043304",
    "price": 2.5,
    "userId": "6553878a5f376fe7e304329d"
  },
  {
    "_id": "655390785f376fe7e3043305",
    "price": 2.5,
    "userId": "6553878a5f376fe7e304329d"
  },
  {
    "_id": "655390845f376fe7e3043309",
    "price": 2.5,
    "userId": "655387935f376fe7e304329e"
  },
  {
    "_id": "655390875f376fe7e304330a",
    "price": 2.5,
    "userId": "655387935f376fe7e304329e"
  },
  {
    "_id": "655390895f376fe7e304330b",
    "price": 2.5,
    "userId": "655387935f376fe7e304329e"
  }
];

exports.seedDatabase = async (req, res, next) => {

  const result = {};

  try{
    await Promise.all([
      User.deleteMany(),
      Voiture.deleteMany(),
      Historique.deleteMany(),
      Facture.deleteMany()
    ])
    const [usersInsert, voituresInsert, historiqueInsert, factureInsert] = await Promise.all([
      User.insertMany(users),
      Voiture.insertMany(voitures),
      Historique.insertMany(historiques),
      Facture.insertMany(factures)
    ]);
    if (usersInsert.length > 0) {
      result.users = usersInsert;
    }

    if (voituresInsert.length > 0) {
      result.voitures = voituresInsert;
    }

    if (historiqueInsert.length > 0) {
      result.historique = historiqueInsert;
    }

    if (factureInsert.length > 0) {
      result.factures = factureInsert;
    }

    res.status(200).json(result);
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}
