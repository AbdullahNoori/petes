// MODELS
const Pet = require('../models/pet.js');

// PET ROUTES
module.exports = (app) => {

  // INDEX PET => index.js

  // NEW PET
  app.get('/pets/new', (req, res) => {
    res.render('pets-new');
  });

   // SEARCH PET
   app.get('/search', function (req, res) {
    Pet
      .find(
          { $text : { $search : req.query.term } },
          { score : { $meta: "textScore" } }
      )
      .sort({ score : { $meta : 'textScore' } })
      .limit(20)
      .exec(function(err, pets) {
        if (err) { return res.status(400).send(err) }

        if (req.header('Content-Type') == 'application/json') {
          return res.json({ pets: pets });
        } else {
          return res.render('pets-index', { pets: pets, term: req.query.term });
        }
    });
  });


  // CREATE PET
  app.post('/pets', (req, res) => {
    var pet = new Pet(req.body);

    pet.save()
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`);
      })
      .catch((err) => {
        // Handle Errors
      }) ;
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-show', { pet: pet });
    });
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-edit', { pet: pet });
    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`)
      })
      .catch((err) => {
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      return res.redirect('/')
    });
  });
}
