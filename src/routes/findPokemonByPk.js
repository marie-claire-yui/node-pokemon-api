const { Pokemon } = require('../db/sequelize') // 25 
const auth = require('../auth/auth') //64

module.exports = (app) => {
  app.get('/api/pokemons/:id',auth, (req, res) => { //64 ajout de auth en deuxième argument
    Pokemon.findByPk(req.params.id) // 25 méthode qui est une promesse qui retourne les info demandées (un seul pok) méthode de ntore model pokemon 
      .then(pokemon => {
        if(pokemon === null){ //rq pour sequelize plus besoin de la méthode parseInt
          const message = 'Le pokémon demandé n\existe pas. Réessayez avec un autre identifiant';
          return res.status(404).json({message})
        }
          const message = 'Un pokémon a bien été trouvé.'
        res.json({ message, data: pokemon })
      })
      .catch(error => {
        const message = 'Le pokémon n\a pas pu être récupéré. Réessayez dans quelques instants.'
        res.status(500).json({message, data: error})
      })
  })
}