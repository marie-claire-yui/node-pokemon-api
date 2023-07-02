const { Pokemon } = require('../db/sequelize') //23 on importe dans notre point de terminaison le model pokemon fourni par notre sequelize
const {Op} = require('sequelize') //51 utilisation de l'opérateur de sequelize

module.exports = (app) => { // 23 on exporte une fonction qui prend en param l'app express entière --> permet de définir les routes dans notre applications tout en ayant des points de terminaisons séparés dans plusieurs modules distinct
  app.get('/api/pokemons', (req, res) => {
    if(req.query.name){ //50 les requêtes avancées ajouté une fonctionnalité de recherche par nom        req.query.name permet d'indiquer à expres que l'on souhaite extraire le paramètre de requête name de l'url pour cela on passe par req fourni par express
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5  //54 rq: express nous transmet tous les paramètres sous formes de chaines de caractère
      // return Pokemon.findAll
      
      if (name.length <2){ //55 juste avant d'executer la requête de recherche il est nécessaire de tester la longueur du terme envoyé par l'utilisateur
        const message = `Le terme de recherche doit contenir au moins 2 caractères.` //55 si la longueur est suffisemment longue alors la requête se passe comme précédemment (sans ce if)
        return res.status(400).json({message})
      }
      
      
      return Pokemon.findAndCountAll //53 pour pouvoir compter le nombre de résultat on remplace findAll par la méthode findAndCountAll (va chercher le nombre de résultat ainsi que le résultat demandé)
      ({
        where: {
          // name: name
          //name: {[Op.eq]:name} // 51 équivalent de la ligne du dessus avec les l'utilisations d'opérateurs sequalize
        name: {[Op.like]: `%${name}%`} //52 mise en place de la fonctionnalité de recherche dans notre api rest on a remplacé la ligne précédente par ce code --> contient name --> nous donnera la liste de tous les pokemons qui contient par exemple ab dans leur nom
        }, //52 GET http://localhost:3000/api/pokemons?name=ab donne piafabec abo et sabelette sur thunder
      order:['name'], //54 pour ordonner les résultats par ordre alphébtique croissant
        // limit:5 //53 limiter le nombre de résultats retourner à 5 (on ajoute l'option limit en paramètre de la fonction findAll)
      limit: limit //54 on obtient un point de terminaison dont le nombre de résultat est paramètrable par le client
      }) //50 findAll méthode proposé par sequelize pour récupérer des données depuis la base sql, fonctionnalité puissante pour récupérer des données depuis la base sql en triant les ressources en fonction de critères et donc permet de créer du sur mesure poru répondre à nos besoins
      // .then(pokemons => 
      .then(({count, rows}) => { //53 à la place de la ligne du dessus
        { //50 méthode findAll et clause where permet une recherche stricte (nom entier du pokemon)
        // const message = `Il y a ${pokemons.length} pokémons qui correspondent au terme de recherche ${name}.`
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.` //53
        // res.json({message, data: pokemons})
        res.json({message, data: rows}) //53 on récupère les deux infos retourner par la méthode puis on construit notre réponse sur mesure avec la réponse adaptée
      }
    }) }else { // 51 on rajoute le  else 
    // Pokemon.findAll() //23 méthode findAll qui retourne une promesse qui contient  la liste de tous les pokemons de la base de données (via sequelize)
    Pokemon.findAll({order:['name']}) // 54 pour ordonner le résultat par ordre croissant alphabétique  
    .then(pokemons => { //51 est-ce que nosu effections la recherche d'un pokemon si oui ou si non (l'utilisateur veut la liste complète de pokemons) test thunder GET http://localhost:3000/api/pokemons?name=Bulbizarre
        const message = 'La liste des pokémons a bien été récupérée.' 
        res.json({ message, data: pokemons }) // 23 on retourne la réponse à l'intérieur de la méthode res.json fourni par express
  }).catch( error => {
    const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.`
    res.status(500).json({message, data: error})
  })
}//33 gestion de notre erreur si findAll() ne renvoit pas un succès dans le then
})
// 23 on obtient un point de terminaison complet dans son propre module javascript contenant la route et le traitement associé
}

