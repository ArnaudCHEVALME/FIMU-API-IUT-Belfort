module.exports = (sequelize, Sequelize, schema) => {
    const Role = sequelize.define("roles", {
        roleId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        schema,
        freezeTableName: true,
        indexes: [{
            unique: true,
            fields: ['name']
        }]
    });
    return Role;
};
