const { Pokemon } = require('../db/sequelize') //23 on importe dans notre point de terminaison le model pokemon fourni par notre sequelize
  
module.exports = (app) => { // 23 on exporte une fonction qui prend en param l'app express entière --> permet de définir les routes dans notre applications tout en ayant des points de terminaisons séparés dans plusieurs modules distinct
  app.get('/api/pokemons', (req, res) => {
    Pokemon.findAll() //23 méthode findAll qui retourne une promesse qui contient  la liste de tous les pokemons de la base de données
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.' 
        res.json({ message, data: pokemons }) // 23 on retourne la réponse à l'intérieur de la méthode res.json fourni par express
  })
}
)}
// 23 on obtient un point de terminaison complet dans son propre module javascript contenant la route et le traitement associé