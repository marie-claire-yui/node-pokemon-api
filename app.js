const express = require('express') //1 importation du paquet express en allant le chercher (la dépendance express) dans le dossier node_modules
//const helper = require('./helper.js') //5 importation du nouveau module helper
const morgan = require('morgan') //11 importation du module morgan (après avoir tapé npm install morgan --save-dev dans le terminal)
const favicon = require('serve-favicon') //13 importation du middleware serve-favicon 13 npm  install serve-favicon --save
const bodyParser = require('body-parser') //17 importation du middleware qui permet le parsing 
const {Sequelize} = require('sequelize') // 20 
const {success, getUniqueId} = require('./helper') //6 et 16 affectation destructurée, on importe la fonction/méthode success plutot que d'importer le module helper
const mysql = require('mysql')
let pokemons = require('./mock-pokemon')


const app = express() //1 on crée une instance de l'application express grace à la méthode du même nom (il s'agit du serveur web sur lequel va fonctionner notre api rest)
const port = 3000 //1 port sur lequel nous allons démarrer notre api rest

// const logger = (req,res,next) => { //9 déclaration du middleware logger, req requette d'entrée https, res requete exposé au client, next indique que le traitement est terminé
//         console.log(`URL : ${req.url}`) //9 logger l'URL de point de terminaison appelé par les consommateurs de notre API rest
//         next()
// }

// app.use(logger) // 9 utiliser le nouveau middleware dans notre application express grâce à la méthode use

// 10 equivalent au 9 mais code plus concis en supprimant la variable intermédiaire
// app.use((req,res,next)=> { // middleware chargé d'afficher l'url des requettes entrantes vers notre api rest
//         console.log(`URL:${req.url}`)
//         next()
// })

//--------------------------------------------------------------------------------------------------
const sequelize = new Sequelize(
        'pokedex',
        'root',
        'root',
        {
                host: 'localhost',
                dialect: 'mysql',
                dialectOptions: {
                        timezone: 'Etc/GHT-2'
                },
                logging:false
        }
)

sequelize.authenticate() //19 tester si la connexion à la base de données a été réussi. méthode authenticate de notre instance sequelize
        .then(_ => console.log('La connexion à la base de données à bien été établie'))
        .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))
//--------------------------------------------------------------------------------------------------

app
   .use(favicon(__dirname + '/favicon.ico')) //13 appel de la méthode app.use afin d'utiliser le nouveau middleware
   .use(morgan('dev')) // 11 utilisation de la méthode use pour attacher le middleware morgan à notre api rest avec express
// 11 option en fonction du détail de log que nous souhaitons afficher. Ici dev optimisation de l'afficahge pour le développement et le débuggage
// rq l'utilisation de la méthode next() est masqué poru nous dans notre code
.use(bodyParser.json()) //17 mise en place du bodyParser sur tout les endpoints de l'api rest en appliquant le middleware grace à la méthode use


//1 route vide qui permet de tester si l'api rest est bien démarré
app.get('/', (req,res)=> res.send('Hello again, Express!')) // notre premier end point (point de terminaison)
//1 app instance de notre application express
//1 Lorsqu'une requête GET est envoyée à une API, elle demande au serveur de renvoyer la représentation d'une ressource spécifique ou d'une collection de ressources.
//1 la méthode de la requete, méthode get va prendre en paramètre deux éléments 
        //1 (le chemin de la requête ou chemin de la route vide de notre api reste, 
        //1 gestionnaire ou fonction dont le role est de fournir une reponse au client lorsque notre point de terminaison est appelé. 
        //1 Cette fonction a deux arguments: 
                //1  req:permet de recupérer un objet request correspondant à la requete reçu en entrée par notre point de terminaison 
                //1 et à contrario l'objet res correspond à réponse cad l'objet que l'on doit renvoyer depuis express à notre client ) Dans notre cas nous utilisons la méthode send de l'objet response afin de retourner le message hello express au client

//1 route qui retourne un premier pokemon
app.get('/api/pokemons/:id', (req,res) => { //1 on remplace 1 qui est une valeur en dure par une valeur dynamique qui est :id
        const id = parseInt(req.params.id) //1 on récupère l'identifiant contenu dans l'url
        const pokemon = pokemons.find(pokemon => pokemon.id === id) //find() Returns the value of the first element in the array where predicate is true, and undefined otherwise.
        const message = "Un pokemon a bien été trouvé." // 5
        // res.send(`Vous avez demandé le pokémon n°${id} dont le nom est ${pokemon.name} `) //1 ici renvoit une chaine de caractère
        //res.json(pokemon) //3 utilisation de la méthode json (à la place de send) pour retourner une réponse sous format json et retourner le type mime sous format json
        // 3 dans le corps de la réponse http, nous passons un objet JS qui est "pokemon" 
        //ainsi grâce à res on retourne une réponse http et on la met au format json avec json() enfin nous renvoyons des informations concret de pokemon grace à la variable pokemon
        //res.json(helper.success(message,pokemon)) //5 on utilise la méthode success afin de retourner une réponse parfaitement structuré
                                                // deux paramètres: le message descriptif , les données brutes du pokemon qu'à demandé l'utilisateur
        res.json(success(message,pokemon)) //6 on appelle la fonction helper sans devoir importer tout le module helper grâce à l'affectation destructurée {}                                    
                                        } ) //6 ceci est un end point renvoyant une réponse json

// app.get('/api/pokemons',(req,res) =>{
//         res.send(`Il y a ${pokemons.length} pokémons dans le pokédex pour le moment.`) // proriété length pour retourner la longeur de l'objet pokemons
// })

app.get('/api/pokemons',(req,res) =>{
        const message = "la liste de pokémon a bien été récupérée"
        res.json(success(message,pokemons)) // 7 on récupère la liste des pokemons en entier (dans la partie data on a un tableau avec tout les pokemons)
})


// 15 ajouter un nouveau pokemon
// 15point de terminaison qui accepte la requette http suivante post
app.post('/api/pokemons', (req,res) => { //15 on défini l'action post auprès d'express ainsiq eu l'url associé
        const id = getUniqueId(pokemons) //16
        const pokemonCreated = { ...req.body, ...{id :id, created:new Date()}} //15 on fusionne les données du pokemon reçu via la réponse http entrante avec l'idientifiant unique qu'on a généré et on ajoute la date de création
        pokemons.push(pokemonCreated) // 15 on ajoute les données de ce pokemon complet à la liste de polemons déjà existant
        const message = `Le pokemon ${pokemonCreated.name} a bien été crée.` //15 message de confirmation pour notre consommateur d'api rest
        res.json(success(message, pokemonCreated)) // 15 réponse json

}) //16 point de terminaison permettant d'ajouter un nouveau  pokémon directement dans notre api rest
// plus tard c'est notre base de données mysql qui se chargera de donnée un identifiant unique (là on l'a fait à la main)

app.put('/api/pokemons/:id',(req,res) => { // 18 pour éviter effet  bore (collision) on fait la modification sur le pokémon côté client et non côté serveur
        const id = parseInt(req.params.id)
        const pokemonUpdated = {...req.body, id:id}
        pokemons = pokemons.map(pokemon => { // 18 modification du pokémon en lui-même: on met à jour notre liste globale de pokemon en remplaçant l'ancien pokemon par la liste avec les nouveaux pokémons modifiés
                return pokemon.id === id ? pokemonUpdated : pokemon //18 pour chaque pokemon de la liste on reetourne le même pokémon sauf s'il s'agit du pokémon a modifier
        })
        const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.` // 18 si pas .name on a l'objet object de pokemon
        res.json(success(message, pokemonUpdated))
})



app.delete('/api/pokemons/:id', (req, res) => {// 19 on supprime le pokemon grace à find et filter
        const id = parseInt(req.params.id)
        const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
        pokemons = pokemons.filter(pokemon => pokemon.id !== id) //19 on obtient en retour une liste nouvelle mais sans le pokemon supprimé
        const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
        res.json(success(message, pokemonDeleted)) // 19 on retourne ici le pokémon supprimé au client
      });








app.listen(port, () => console.log(`Notre application Node est démarrée sur: http://localhost:${port}`)) //1 on démarre l'api rest sur le port 3000 et on affiche un message de confirmation sur le terminal de commande grace à la méthode listen fournit par express





// Pour définir un nouveau endpoint avec Express, il est nécessaire de combiner une méthode HTTP, 
//une URL et une méthode de gestion chargée de fournir une réponse au client.

// Il est possible de transmettre un ou plusieurs paramètres à un point de terminaison donnée, via l’URL.

// On peut récupérer les paramètres transmis par l’URL à un endpoint,
// grâce à la propriété params de la requête entrante.

// Il faut être attentif au fait que Express convertit chaque paramètre issu de l’URL en une chaîne de caractère. 
// Si vous attendez plutôt un nombre, il va falloir adapter le paramètre vous-même.

// On peut bien sûr utiliser les paramètres reçus en entrée afin de construire une réponse dynamique pour le frontend.


// 7 en résumé
// - On juge une API Rest essentiellement sur la qualité des réponses qu’elle renvoie.

// - D’un point de vue purement technique, le rôle d’une API Rest consiste simplement à intercepter une requête HTTP,
// et retourner une réponse HTTP avec les données au format JSON.

// - Une réponse HTTP est constituée de 3 éléments distincts : les données au format JSON, 
//le type MIME application/json, et enfin le code de statut HTTP.

// - Nous verrons le code statut HTTP plus tard, car il a un rôle plus adapté pour la gestion des erreurs.

// - Pour retourner une réponse HTTP au format JSON, on utilise la méthode json() fournie par Express.
// - Cette méthode s’occupe pour nous de structurer nos données au format JSON, 
//et d’attribuer le type MIME application/json dans la requête de retour.




// commande à effectuer dans le terminal
// --------------------------------------------------------------------------------------------------------
// // ouvrir terminal sur vscode 
// ctr +%

// // vérifier les versions
// node -v
// nom -v

// // éxécution du script app.js et affichage sur le terminal
// node app.js

// rq : app.js est le script  de point d’entrée d’application

// // créer un fichier package.json 
// npm init

// // package.json
// on écrit start à la place de test et node app.js

// npm run start (équivaut maintenant à node app.js)

// // installation de dépendance (ici express qui est utilisé pour créé une api rest avec node)
// npm install express –save

// → téléchargement et installation de la librairie express (dans node_modules) qui est nouvellement créer. Mais aussi des dépendances de express en regardant le fichier json. La librairie express est donc adaptable à notre projet.

// Rq : l’option save permet de rajouter express dans la liste des dépendances écrit dans le fichier package.json

// // démarrer l’api rest
// npm run start

// // couper l’api rest
// ctrl + c

// // relancer 
// npm run start

// // rafraichir l’oordinateur

// // pour éviter cela installation de nodemon
// npm install --save-dev nodemon

// // remodifier le package.json en remplaçant dans le start node par nodemon
// npm run start (va lancer nodemon app.js)

// remarque: je n'ai pas push le node_module
// pour git clone écrire la commande 
// npm install 
//( On demande tout simplement à NPM d’installer les dépendances listées dans le fichier package.json, ou plutôt celles du fichier package-lock.json)

// --------------------------------------------------------------------------------------------------------

// 8 middleware: fonctions js capable d'intéragir avec les requetes https entrantes et sortantes de l'api rest
// 8 fonction js qui ont accès à certaines données d'express
// 8  en permettant d'appliquer un traitement aux requetes entrantes et sortantes
// 8 fonctionne par dessus les end point existant
// 8 accèdent aux objet req et res d'express --> plusieurs cas d'utilisation possibles
// 8 une fois le traitement du middleware terminé: indiqué à express grace à la fonction next()
// 8 req res et next() sont transmis par express directement

// const middleware = (req, res, next) => {
//         //traitement quelconque
//         // on peut i ntervenir sur les objets res et res
//         // puis on indique à express que le traitement est terminé
//         next()
// }

// catégories de middlewares: 
        // le middleware d'applications
        // le middleware du routeur
        // le middleware de traitement d'erreur
        // le middleware intégré
        // le middleware tiers 

// 12 communication entre les middlewares en se transmettant les paramètres respectifs (d'autres fonctionnent sans transmission d'info)
// 12 peuvent être combiné entre eux et former une chaine de traitement complète
// 12 chaque requete entrante vers l'api rest est transmise au premier middleware 
// 12 de la chaine qui le transmet au suivant et ainsi de suite jusqu'au end point de notre api rest
// 12 mécanisme identique pour notre réponse https mais dans le sens inverse




// 14 en résumé
// Les Middlewares sont des fonctions JavaScript, capable d’interagir avec les requêtes entrantes et sortantes
// de votre API Rest.
// On peut catégoriser les Middlewares en cinq catégories différentes :
// les Middlewares d’application, les Middlewares du router, ceux du traitement d’erreurs, ceux intégrés, et enfin les Middlewares tiers.
// Pour mettre en place un Middleware dans notre API Rest, il faut faire appel à la méthode use() d’Express.
// Pour pouvoir utiliser un Middleware tiers dans son API Rest, il faut l’installer,
// puis l’importer et enfin on peut en faire ce que l’on souhaite dans notre code.
// L’utilisation de la méthode next() est très importante pour indiquer à Express que 
//le traitement du Middleware courant est terminé, et que l’on peut passer au Middleware suivant.
// Les Middleswares peuvent être combinés, afin de former une chaîne de traitement.
// Il est également possible de les faire communiquer entre eux, en leur transmettant leurs paramètres respectifs.
// L’ordre de déclaration des Middlewares a une importance. 
//Il faut être particulièrement attentif si certains traitements doivent être effectués avant d’autres, 
//et ajuster l’ordre de déclaration des Middlewares en conséquence.