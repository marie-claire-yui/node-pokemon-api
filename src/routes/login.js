const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
  
module.exports = (app) => {
  app.post('/api/login', (req, res) => { //58 déclaration d'un nouvel endpoint, récupération des paramètres de l'URL
  
    User.findOne({ where: { username: req.body.username } }).then(user => { //58 requête pour obtenir les informations d'un utilisateur avecc la méthode findOnede sequelize
      
      if(!user){ //59 on vérifie si l'utilisateur existe ou non en fonction de l'identifiant indiqué par le client de ntore api rest si ça n'est pas le cas on rtourne un message d'erreur 404
        const message = `L'utilisateur demandé n'existe pas.` 
        return res.status(404).json({message})
      }
      
        bcrypt.compare(req.body.password, user.password).then(isPasswordValid => { //58 méthode magique permet de comparer le mot de passe (en clair) saisie par l'utilisateur avec le mot de passe encrypté/sécurisé présent dans notre base de donnée
        // if(isPasswordValid) { //58 si l'utilisateur saisie un mot de passe erronée ou frauduleux nous pouvons refuser l'accès à l'api rest
        //   const message = `L'utilisateur a été connecté avec succès`;
        //   return res.json({ message, data: user })
        // }
        if(!isPasswordValid){ //59 éventualité d'un mot de passe eronné directement (l'inverse)
            const message = `Le mot de passe est incorrect.`;
            return res.status(401).json({message})
        }

        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({message, data: user})
      })
    })
    .catch(error =>{ //59 erreur générique à la fin de notre point de terminaison: cas d'un appel réseau qui échouerai
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
        return res.json({message, data: error})
    })
  })
}

//58 point de terminaison permettant l'authentification de l'utilisateur
//58 rq: la méthode compare retourne une promesse, c'est un traitement asynchrone, en effet il faut du temps pour décrypter le mot de passe sécurisé afin de le comparer au message en clair

//59 deux types d'erreurs possibles, 1) l'utilisateur mauvais identifiant -> on peut renseigner que l'identifiant n'existe pas dans notre base de donnée 
//59 2) id correcte mais mot de passe invalide 