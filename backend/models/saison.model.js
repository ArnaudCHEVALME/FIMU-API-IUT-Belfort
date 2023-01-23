module.exports = (sequelize, Sequelize, schema) => {
    return sequelize.define("saison", {
        saisonId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        dateSaison: {
            type: Sequelize.STRING,
            allowNull: false
        },
        theme: {
            type: Sequelize.STRING,
            allowNull: false
        },
        couleur1:{
            type: Sequelize.STRING,
            allowNull: false
        },
        couleur2:{
            type: Sequelize.STRING,
            allowNull: false
        },
        img64:{
            type: Sequelize.TEXT,
            allowNull: true
        }
    },{schema});
};