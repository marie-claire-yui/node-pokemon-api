module.exports = (sequelize, DataTypes) => { // 21 nous exportons une fonction qui contient param objet sequelize permettant la connexion à la base de donnée pour sequelize 
    return sequelize.define('Pokemon', { // 21 propriété define qui permet de déclarer un nouveau model auprès de sequelize 
      id: {  //21 param data types qui permet de définir le type de donnnées de chaque propriété de notre model ex name string pv int
        type: DataTypes.INTEGER, // 21 define prend trois param (nom du model, description du model, config global au model)
        primaryKey: true, //21 la méthode define retourne directement le nouveau model déclaré auprès de sequalize afin de créer et d'intéragir avec notre base de données
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false
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