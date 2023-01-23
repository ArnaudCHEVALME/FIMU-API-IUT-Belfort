module.exports = (sequelize, Sequelize, schema) => {
    const Scene = sequelize.define("scene", {
        sceneId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        capacite: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        latitude: {
            type: Sequelize.REAL,
            allowNull: false
        },
        longitude: {
            type: Sequelize.REAL,
            allowNull: false
        },
        interieur: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        nom: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{schema,
        indexes: [{
            unique: true,
            fields: ['nom', 'longitude', 'latitude']
        }]});
    return Scene;
};