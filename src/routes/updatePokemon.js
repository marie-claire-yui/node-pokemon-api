const { Pokemon } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize') //40 //47
const auth = require('../auth/auth') //64
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', auth, (req, res) => { // 64 ajout de auth en deuxième argument
    const id = req.params.id
    Pokemon.update(req.body, { //28 méthode update est ce qui permet d'appliquer les modifications en base de données
      where: { id: id }
    })
    .then(_ => {
      return Pokemon.findByPk(id).then(pokemon => {
        if(pokemon === null){
          const message = 'Le pokémon demandé n\'existe pas. Réessayez avec un autre identifiant;';
          return res.status(404).json({message})
        } //28 pour envoyer le  nouveau pokemon modifié de la base de donnée (permet de récupérer un pokémon avec un certain identifiant en bdd et ensuite le retourner à nos clients)
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
      // .catch(error => {
      //   const message = 'Le pokémon n\a pas pu être modifié. Réessayez dans quelques instants'
      //   res.status(500).json({message, data: error})
      // })
    })
    .catch(error => {
      if(error instanceof ValidationError) { //40
        return res.status(400).json({message: error.message, data: error})
      }
      if(error instanceof UniqueConstraintError){ //47
        return res.status(400).json({message : error.message, data: error})
      }
      const message = 'Le pokémon n\'a pas pu être modifié. Réessayez dans quelques instants. '
      res.status(500).json({message, data: error})
    })
    
  })
}
// 34 double gestion des erreurs 500 et une erreur 404
// 34 il existe une duplication du code catch 
// 34 pour factoriser le code on peut mettre une return
// 34 cela permet de transmettre l'"erreur éventuelle de la méthode find by pk dans la méthode catch plsu bas dans le code
// 34 permet de traiter toutes les erreurs 500 en une seule fois
// 34 code plus propre