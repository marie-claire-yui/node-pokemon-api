const { Pokemon } = require('../db/sequelize')
  
module.exports = (app) => {
  app.delete('/api/pokemons/:id', (req, res) => {
    Pokemon.findByPk(req.params.id).then(pokemon => { //28 on récupère le pokémon en bdd pour le retourner au client avant de le supprimer
      if (pokemon === null){
        const message = 'Le pokémon demandé n\'existe pas. Réessayez avec un autre identifiant';
        return res.statut(404).json({message})
      }

      const pokemonDeleted = pokemon;
      return Pokemon.destroy({ // 28 suppression du pokemon
        where: { id: pokemon.id }
      })
      .then(_ => {
        const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
        res.json({message, data: pokemonDeleted })
      })
    })
    .catch(error => {
    const message = 'Le pokémon n\'a pas pu être supprimé. Réessayez dans quelques instants.'
    res.status(500).json({message, data: error})
  })
  })
}

// 35 erreur 500 si la requête effectué par sequelize echoue auprès de la bdd
// 35 erreur 404 si le client demande à supprimer un pokémon qui n'existe pas
//35 d'abord l'utilisateur va demander la suppression d'un pokémon, dans ce cas on doit confirmer que le pokémon a été supprimé
//35 si l'utilisateur demande à supprimer ce même pokémon il faudra lui retourner une erreur 404 car ce pokémon n'existe plus
// 35 on vérifie en premier lieu que le pokémon existe bien en base de donnée avec la méthode findByPk puis on le détruit avec la fonction destroy