module.exports = (sequelize, Sequelize, schema) => {
    const SousGenre = sequelize.define("sousGenre", {
        sousGenreId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        libelle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nbRecherche: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    },{schema,
        indexes: [{
            unique: true,
            fields: ['libelle']
        }]});
    return SousGenre;
};
