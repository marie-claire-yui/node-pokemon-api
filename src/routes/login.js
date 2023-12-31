const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') //61
const privateKey = require('../auth/private_key')  //61

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
        if(!isPasswordValid){  //59 éventualité d'un mot de passe eronné directement (l'inverse)
            const message = `Le mot de passe est incorrect.`;
            return res.status(401).json({message})
        }

        //JWT 61
        const token = jwt.sign( //61 méthode sign du module jsonwebtoken 3 paramètres pour engendrer un jeton JWT pourrécupération dans la constante token
            {userId: user.id},
            privateKey,
            {expiresIn: '24h'}
        )

        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({message, data: user, token}) //61 ajout token retourne la const token créer plus haut quand identifiant correcte
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

//65 L’authentification est un processus qui permet de restreindre l’accès aux points de terminaisons de notre API Rest.
//65 La mise en place d’une authentification côté API Rest nécessite de respecter deux exigences principales : encrypter le mot de passe et sécuriser l’échange des données.
//65 L’identifiant que les clients utilisent lors de l’authentification doit être unique.
//65 Le module bcrypt permet d’encrypter les mots de passe de nos utilisateurs sous la forme d’un hash, que nous pouvons sauvegarder en base de données de manière sûre.
//65 L’authentification entre une application web une API Rest repose sur un standard reconnu, qui est l’authentification avec les « JSON Web Token ».
//65 Un jeton JWT est une clef cryptée, avec une durée de validité dans le temps, et qui se présente sous la forme d’une chaîne de caractères.
//65 Le module jsonwebtoken permet de générer et vérifier la validité des jetons JWT, grâce aux méthodes sign et verify.
//65 Pour générer un jeton JWT valide, trois informations différentes sont nécessaires : les informations de l’utilisateur, une clé secrète, et une date de validité pour le jeton.
//65 Le jeton JWT transite dans l’en-tête HTTP authorization, avec pour valeur "Bearer <JWT>".
//65 Il ne faut pas appliquer le Middleware d’authentification sur le point de terminaison de la connexion, sinon cela empêche tous les utilisateurs d’accéder à notre API Rest.