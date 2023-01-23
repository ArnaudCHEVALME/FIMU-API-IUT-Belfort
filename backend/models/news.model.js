module.exports = (sequelize, Sequelize, schema) => {
    const News = sequelize.define("news", {
        newsId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        titre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        publishAt: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{schema});
    return News;
};
