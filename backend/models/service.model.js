module.exports = (sequelize, Sequelize, schema) => {
    const Service = sequelize.define("service", {
        serviceId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        libelle: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{schema,
        indexes: [{
            unique: true,
            fields: ['libelle']
        }]});
    return Service;
};