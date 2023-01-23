module.exports = (sequelize, Sequelize, schema) => {
    const Concert = sequelize.define("concert", {
        concertId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        debut: {
            type: Sequelize.STRING,
            allowNull: false
        },
        heure: {
          type: Sequelize.STRING,
          allowNull: false
        },
        duree: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nbPersonne: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    },{schema,
        indexes: [{
            unique: true,
            fields: ['debut','heure','artisteId', 'sceneId']
        }]});
    return Concert;
};