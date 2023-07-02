const validTypes = ['Plante','Poison','Feu','Eau','Insecte','Vol','Normal','Electrik','Fée'] //44 var contenant tous le stypes autorisés pour les pokémon, on va restreindre les types qui vont être utilisés grace à une liste de types qui va être utilisé

module.exports = (sequelize, DataTypes) => { // 21 nous exportons une fonction qui contient param objet sequelize permettant la connexion à la base de donnée pour sequelize 
    return sequelize.define('Pokemon', { // 21 propriété define qui permet de déclarer un nouveau model auprès de sequelize 
      id: {  //21 param data types qui permet de définir le type de donnnées de chaque propriété de notre model ex name string pv int
        type: DataTypes.INTEGER, // 21 define prend trois param (nom du model, description du model, config global au model)
        primaryKey: true, //21 la méthode define retourne directement le nouveau model déclaré auprès de sequalize afin de créer et d'intéragir avec notre base de données
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
         // 46 RQ: l'idel serait d'avoir que des validateurs mais des fois il n y  a pas d'autre choix que de passer par des contraintes sql
        // 46 ex contrainte d'unicité fourni par sequelize: contrainte sequelize. modif du script en create et update pour les erreurs 400 pour l'unicité
        unique: { 
          msg: 'Le nom est déjà pris'
        },
        validate: { //41
          notEmpty:{ msg: 'Le nom ne peut pas être vide.'},
          notNull: {msg :'Le nom est une propriété requise'}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { //38 ajout de deux validateur pour le type bien un nombre entier et le chammp de point de vie n'est pas nul via  not null
          isInt: { msg: "Utilisez uniquement des nombres entiers pour les points de vie."},
          min: { //42
            args: [0],
            msg: 'Les points de vie doivent être supérieures ou égales à 0.'
          },
          max: {
            args: [999],
            msg: 'Les points de vie doivent être inférieures ou égales à 999.'
          },
          notNull: { msg: "Les points de vie  sont une propriété requise"}
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{ //41
          isInt:{msg: 'Utilisez uniquement des nombres entiers pour les points de dégâts.'},
          min: { //42 
            args: [0],
            msg: 'Les points de dégâts doivent être supérieures ou égales à 0.'
          },
          max: {
            args: [99],
            msg: 'Les points de dégâts doivent être inférieures ou égales à 99.'
          },
          notNull: {msg : 'Les points de dégâts sont une propriété requise.'}
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{ //41
          isUrl:{ msg: 'Utilisez uniquement une URL valide pour l\'image.'},
          notNull:{msg: 'L\'image est une propriété requise.'}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){ // 26 getter: format pour base de donénes --> API Rest
          return this.getDataValue('types').split(',')
        },
        set(types){ // 26 Setter: format de l'API Rest --> base de données
          this.setDataValue('types',types.join())
        },

       
        validate: {
          isTypesValid(value){ //43 on défini une fonction isTYpesValid nom arbitrairement, validateur personnalisé et non natif de sequelize
            if(!value){ //43 prend en param une valeur value correspondant à la valeur de la propriété type contenu en base de donnée sans prendre en compte le getter et le setteur de cette propriété 
              throw new Error('Un pokémon doit au moins avoir un type.')
            }
            if(value.split(',').length >3) {
              throw new Error('Un pokémon ne peux pas avoir plus de trois types')
            }
            value.split(',').forEach(type => { //44 on vérifie chacun des types d'un pokémon pour savoir s'il est bien inclu dans la liste prédéfini ou non
              if(!validTypes.includes(type)){ //44 split car les données en brute viennent directememnt de la base de données sql
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante: ${validTypes}`)
              }
            });
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }

  // 37 chaque champ possède au moins deux information: 1 type, et le fait de ne pas pouvoir posséder une valeur nulle
  // 37: le pokémon doit être un champ de caractère différent de nul 
  // 37: rq '' n'est pas considéré comme nul, ainsi que le valeur 0 concernant les points de vie

