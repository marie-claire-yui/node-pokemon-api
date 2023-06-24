const { Pokemon } = require('../db/sequelize')
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, { //28 méthode update est ce qui permet d'appliquer les modifications en base de données
      where: { id: id }
    })
    .then(_ => {
      Pokemon.findByPk(id).then(pokemon => { //28 pour envoyer le  nouveau pokemon modifié de la base de donnée (permet de récupérer un pokémon avec un certain identifiant en bdd et ensuite le retourner à nos clients)
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
    })
  })
}