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
          notNull: { msg: "Les points de vie  sont une propriété requise"}
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{ //41
          isInt:{msg: 'Utilisez uniquement des nombres entiers pour les points de dégâts.'},
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

