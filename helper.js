
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

exports.success = (message, data) => {  
    return {message,data}
}

