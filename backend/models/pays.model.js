module.exports = (sequelize, Sequelize, schema) => {
	const Pays = sequelize.define("pays", {
		paysId: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		nompays: {
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
			fields: ['nompays']
		}]});
	return Pays;
};
