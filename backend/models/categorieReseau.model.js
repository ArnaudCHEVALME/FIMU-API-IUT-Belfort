module.exports = (sequelize, Sequelize, schema) => {
    const CategorieReseau = sequelize.define("categorieReseau", {
        categorieReseauId: {
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
    return CategorieReseau;
}