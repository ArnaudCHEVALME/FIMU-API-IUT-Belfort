const {authJwt} = require("../middleware");

module.exports = app => {
	const importC = require("../controllers/import.controller");
	const router = require("express").Router();

	// Create a new Genre
	router.post("/",[
		authJwt.verifyToken,
		authJwt.isModeratorOrAdmin
	], importC.importCSV);

	app.use('/importCSV', router);
};