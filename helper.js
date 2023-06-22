
//4 moddèle helper.js qui permet d'exposer une réponse plus complète au consommateur de notre api rest

//4 dans ce module on déclare une méthode success qui prend deux paramètres pour construire une n ouvellel réponse json mieux structurée
    //4 un message concis de description
    //4 données brute attendu par le consommateur
//4 puis on exporte cette méthode success 

// const success = (message, data) => { 
//     return {
//         message: message,
//         data: data
//     }
// }

// exports.success

//---------------------------------------------------------------------------------------------------------------

// exports.success = (message, data) => {  // on évite la variable intermédiaire success et on la retourne directement
//     return {
//         message: message,
//         data: data
//     }
// }



//---------------------------------------------------------------------------------------------------------------
//4 syntaxe permettant de fusionner la propriété et la valeur d'un objet js s'ils ont le même nom
//4 exemple
//4 const name = "Bulbizarre"; on déclare une constante
//4 const pokemon = {name: name}; // sans le raccourci ECMAScript
//4 const pokemon = {name}; // avec le raccourci ECMAScript
//----------------------------------------------------------------------------------------------------------
// exports.success = (message, data) => {  
//     return {message,data}
// }

// //15 méthode de génération d'identifiants (méthode outil) unique lors de l'ajout d'un nouveau pokémon
// exports.getUniqueId= (pokemons) => {
//     const pokemonsIds = pokemons.map(pokemon => pokemon.id) // 15 on transforme le tableau des pokemons en un tableau d'identifiant de pokemons map qui fontionne comme un for mais en retournant un nouveau tableau
//     const maxId = pokemonsIds.reduce((a,b) => Math.max(a,b)) // 15 on calcule l'identifiant existant le plus grand (reduce permet de comparer les éléments 2 à 2 dans un tableau) on a ici le max id
//     const uniqueId = maxId + 1 // 15 on incrémente max Id de 1

//     return uniqueId
// }