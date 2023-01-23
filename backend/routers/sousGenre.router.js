const {authJwt} = require("../middleware");
const sousGenre = require("../controllers/sousGenre.controller");
module.exports = app => {
    const sousGenre = require("../controllers/sousGenre.controller.js");
    const router = require("express").Router();

    // Create a new sousGenre
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin
    ], sousGenre.create);


    // Retrieve all sousGenres
    router.get("/", sousGenre.findAll);

    // Retrieve a single sousGenre with id
    router.get("/:id", sousGenre.findOne);

    // Update a sousGenre with id
    router.put("/:id", sousGenre.update);

    // Delete a sousGenre with id
    router.delete("/:id",[authJwt.verifyToken,authJwt.isAdmin], sousGenre.delete);

    // Create a new sousGenre
    router.delete("/",[authJwt.verifyToken,authJwt.isAdmin], sousGenre.deleteAll);

    app.use('/sousGenre', router);
};