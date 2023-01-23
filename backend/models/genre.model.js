module.exports = (sequelize, Sequelize, schema) => {
	const Genre = sequelize.define("genre", {
		genreId: {
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
	}, {
		schema,
        indexes: [{
			unique: true,
			fields: ['libelle']
		}]
	});
	return Genre;
};
