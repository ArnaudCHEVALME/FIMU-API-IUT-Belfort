const {authJwt} = require("../middleware");
const auth = require("../middleware/authJwt");
module.exports = app => {
    const reseaux = require("../controllers/lienReseau.controller.js");
    const router = require("express").Router();

    // Create a new Genre
    router.post("/",[
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin
    ], reseaux.create);

    // Retrieve all Genres
    router.get("/", reseaux.findAll);

    // Retrieve a single Genre with id
    router.get("/:id", reseaux.findOne);

    // Update a Genre with id
    router.put("/:id", reseaux.update);

    // Delete a Genre with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], reseaux.delete);

    // Create a new Genre
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin],reseaux.deleteAll);

    app.use('/liensReseaux', router);
};