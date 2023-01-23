module.exports = (sequelize, Sequelize, schema) => {
    return sequelize.define("typeStand", {
        typeStandId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        libelle: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },{schema,
        indexes: [{
            unique: true,
            fields: ['libelle']
        }]});
};