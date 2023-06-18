const express = require('express') //1 importation du paquet express en allant le chercher (la dépendance express) dans le dossier node_modules
//const helper = require('./helper.js') //5 importation du nouveau module helper
const {success} = require('./helper') //6 affectation destructurée, on importe la fonction/méthode success plutot que d'importer le module helper
let pokemons = require('./mock-pokemon')


const app = express() //1 on crée une instance de l'application express grace à la méthode du même nom (il s'agit du serveur web sur lequel va fonctionner notre api rest)
const port = 3000 //1 port sur lequel nous allons démarrer notre api rest

//1 route vide qui permet de tester si l'api rest est bien démarré
app.get('/', (req,res)=> res.send('Hello again, Express!')) // notre premier end point (point de terminaison)
//1 app instance de notre application express
//1 Lorsqu'une requête GET est envoyée à une API, elle demande au serveur de renvoyer la représentation d'une ressource spécifique ou d'une collection de ressources.
//1 la méthode dela requete, méthode get va prendre en paramètre deux éléments 
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