const { Pokemon } = require('../db/sequelize') // 25 
  
module.exports = (app) => {
  app.get('/api/pokemons/:id', (req, res) => {
    Pokemon.findByPk(req.params.id) // 25 méthode qui est une promesse qui retourne les info demandées (un seul pok) méthode de ntore model pokemon 
      .then(pokemon => { //rq pour sequelize plus besoin de la méthode parseInt
        const message = 'Un pokémon a bien été trouvé.'
        res.json({ message, data: pokemon })
      })
  })
}