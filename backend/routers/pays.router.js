const {authJwt} = require("../middleware");

module.exports = app => {
    const pays = require("../controllers/pays.controller.js");
    const router = require("express").Router();

    // Create a new pays
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin], pays.create);

    // Retrieve all pays
    router.get("/", pays.findAll);

    // Retrieve a single pays with id
    router.get("/:id", pays.findOne);

    // Update a pays with id
    router.put("/:id", pays.update);

    // Delete a pays with id
    router.delete("/:id",[authJwt.verifyToken,authJwt.isAdmin], pays.delete);

    // Create a new pays
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin], pays.deleteAll);

    app.use('/pays', router);
};