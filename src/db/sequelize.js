const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user') //55 on importe le model user qu'on a implementé 
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt') //56 on importe le module bcrypt

const sequelize = new Sequelize('pokedex', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
  
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes) //55 on instancie le model user auprès de sequelize 
  
const initDb = () => {
  return sequelize.sync({force: true}).then(_ => {
    pokemons.map(pokemon => {
      console.log('INIT DB')
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        // types: pokemon.types.join()
        types: pokemon.types // 26 on a la méthode join dans pokemon.js
      }).then(pokemon => console.log(pokemon.toJSON()))
    })

bcrypt.hash('pikachu',10) //56 méhotde hash 2 paramètres (mot de passe renseigné en dur et le saltrounds = temps nécessaire poru hacher correctement un mot de passe plus il est long plus il sera difficile d'être décrypté)
.then(hash => User.create({ username: 'pikachu', password: hash})) //56 on récupère le mot de passe crypté et le poussé en base de donnée (ne pas le confondre avec le mot de passe en clair! nous sauvegardons en bdd le mot de passe une fois qu'il est crypté et jamais avant) ainsi que l'utilisateur quand on vérifie en bdd on voit que le mot de passe est désormais hashé avant d'être stocké en bdd
// User.create({ //55 on pousse un nouvel utilisateur à notre bddd mysql 
//   username: 'pikachu',
//   password: 'pikachu'
// })
    .then(user => console.log(user.toJSON()))

    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { //... 55 ajout d'user on expose notre model user au reste du projet pour l'utiliser ailleurs dans notre api rest
  initDb, Pokemon , User
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

    //55 ajout d'un utilisateur à notre bdd au démarrage de notre api rest
    // 55 l'utilisateur pikachu et mot de passe pikachu dans notre base de donnée cependant en clair (encore)

//56 il existe des modules en node js qui permettent d'encrypter des mots de passe: bcrypt
// 56 dans le terminal: npm install bcrypt --save
// 56 utilisation d'un algorithme interne pour encrypter les mots de passe de nos utilisateurs sous la forme d'un hash
// 56 qu'on peut sauvegarder dans notre base de donnée de manière sure
// 56 lorsque l'utilisateur tentera de se connecter bcrypt va crypter le mot de passe de l'utilisateur et le comparer à celuil stocker dans la base de donnée
// 56 si c'est bon, l'utilisateur va pouvoir accéder aux autres points de terminaison de notre api rest
// 56 encryptage du mot de passe donné par l'utilisateur grâce à une méthode nommée hash
