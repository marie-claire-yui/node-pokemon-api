module.exports = (sequelize,DataTypes) => {
    return sequelize.define('User', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username:{
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    })
}

// 54 ajouter une contrainte d'unicité
//54 3 propriétés id, username, et password
// 54 manque une règle de validation importante dans ce model
// 54 sequelize va rajouter tout seul les propriétés created et updated à tout les nouveaux models que nosu déclarons
// 54 --> nous verrrons donc ces propriétés apparaître dans la base de données

//55 au démarrage de notre api rest nosu initialisons le contenus de ntore base de données avec 12 pokémon
// 55 on fait la même chose avec un utilisateur