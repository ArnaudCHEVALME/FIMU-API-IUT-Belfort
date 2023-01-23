module.exports = (sequelize, Sequelize, schema) => {
    return sequelize.define("permissions", {
        permId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        libelle: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        schema,
        freezeTableName: true,
        indexes: [{
            unique: true,
            fields: ['libelle']
        }]
    });
};
