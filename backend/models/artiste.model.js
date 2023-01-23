module.exports = (sequelize, Sequelize, schema) => {
    const Artiste =  sequelize.define("artiste", {
        artisteId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bio: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        linkClip: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nbRecherche: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        banner:{
            type:Sequelize.STRING,
            allowNull:true
        }
    }, {schema,
        indexes: [{
            unique: true,
            fields: ['name']
        }]});
    return Artiste;
}

