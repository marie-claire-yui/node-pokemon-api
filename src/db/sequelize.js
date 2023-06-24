const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const pokemons = require('./mock-pokemon')
  
const sequelize = new Sequelize('pokedex', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
  
const Pokemon = PokemonModel(sequelize, DataTypes)
  
const initDb = () => {
  return sequelize.sync({force: true}).then(_ => {
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        // types: pokemon.types.join()
        types: pokemon.types // 26 on a la méthode join dans pokemon.js
      }).then(pokemon => console.log(pokemon.toJSON()))
    })
    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { 
  initDb, Pokemon
}


// 31     Sequelize est entièrement construit sur le mécanisme des modèles. Il est donc nécessaire de bien comprendre ce fonctionnement avant d’aller plus loin avec Sequelize.

    // Un modèle est une abstraction qui représente une table dans notre base de données.
    // On peut retenir l’équation suivante : 1 modèle Sequelize = 1 table en base de donnée.

    // Une fois les modèles déclarés auprès de Sequelize, il est nécessaire de demander à Sequelize 
    //de synchroniser ces modèles avec la base de données sous-jacente, grâce à la méthode sync().

    // Pour ajouter des lignes à une table en base de données, 
    //il faut créer de nouvelles instances d’un modèle avec la méthode create().

    // Sequelize permet d’interagir très simplement avec une base de données 
    //et de mettre en place les opérations CRUD : findAll, findByPk, create, update, destroy.

    // Sequelize permet de définir des getters et des setters sur les modèles, 
    //qui sont très utile pour attacher des traitements supplémentaires avec peu de code supplémentaire.

    // Il existe plusieurs architectures possibles pour une API Rest. 
    //La manière la plus efficace de mettre en place cette architecture, c’est de créer un module JavaScript 
    //pour chaque point de terminaison, et de les déclarer tous au niveau du point d’entrée de votre projet.