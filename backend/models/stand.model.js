module.exports = (sequelize, Sequelize, schema) => {
    const Stand = sequelize.define("stand", {
        standId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        longitude: {
            type: Sequelize.REAL,
            allowNull: false
        },
        latitude: {
            type: Sequelize.REAL,
            allowNull: false
        },
        nom: {
            type: Sequelize.STRING,
            allowNull: true
        },
    },{schema,
        indexes: [{
            unique: true,
            fields: ['nom','longitude', 'latitude']
        }]});
    return Stand;
};