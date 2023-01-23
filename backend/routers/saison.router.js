const {authJwt} = require("../middleware");
module.exports = app => {
    const saison = require("../controllers/saison.controllers.js");
    const router = require("express").Router();

    // Create a new saison
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin], saison.create);

    // Retrieve all saison
    router.get("/", saison.findAll);

    // Retrieve a single saison with id
    router.get("/:id", saison.findOne);

    // Update a saison with id
    router.put("/:id", saison.update);

    // Delete a saison with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], saison.delete);

    // Create a new saison
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin], saison.deleteAll);

    app.use('/saisons', router);
};