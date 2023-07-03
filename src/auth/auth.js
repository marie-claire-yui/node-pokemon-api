const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
  
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization //62 on récupère l'entête htttp nommé authorization, c'est dans cet entête que transietera le jeton jwt envoyé par notre consommateur 
  
  if(!authorizationHeader) { //62 on vérifie que le jeton a bien été fourni
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return res.status(401).json({ message })
  }
    
    const token = authorizationHeader.split(' ')[1] //62 on récupère le jeton JWT dans une constante token
    //62 authorization : Bearer <JWT> pour extraire le jeton jwt d'un utilisateur il faut retirer le terme BEarer avant l'espace qui sert de séparateur et récupérer la valeur dujeton uniquement
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => { //62 on vérifie ensuite que le jeton est bien valide grâce à la méthode verify, méthode complémentaire a sign
    if(error) { //62 refuser l'accès à l'utilisateur s'il n'a pas fourir le jeton JWT valide ou alors que ce jeton est celuli d'un autre utilisteur
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return res.status(401).json({ message, data: error })
    }
  
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message })
    } else {
      next() // 62 libre accès aux différents points de terminaison que l'utilisateur a demandé (après passage de tous les tests)
    }
  })
}


//62 nous avons désormais un middleware qui vérifie la validité des jetons JWT transmis par nos clients
//62 c'est un nouveau middleware de sécurité pour l'authentification et la validation des jetons JWT
//63 il nous reste plus qu'à sécuriser un par un nos endpoints avec ce nouveau middleware de sécurité