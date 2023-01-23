module.exports = (sequelize, Sequelize, schema) => {
    const LienReseau = sequelize.define("lienReseau", {
        lienReseauId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        lien: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: { isUrl: true }
        }
    },{schema,
        indexes: [{
            unique: true,
            fields: ['lien']
        }]});
    return LienReseau;
};