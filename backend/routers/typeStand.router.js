const {authJwt} = require("../middleware");

module.exports = app => {
    const typeStand = require("../controllers/typeStand.controller.js");
    const router = require("express").Router();

    // Create a new type of stand
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin
    ],typeStand.create);
    

    // Retrieve all type of stands
    router.get("/", typeStand.findAll);

    // Retrieve a single type of stand with id
    router.get("/:id", typeStand.findOne);

    // Update a type of stand with id
    router.put("/:id", typeStand.update);

    // Delete a type of stand with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], typeStand.delete);

    // Create a new type of stand
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin], typeStand.deleteAll);

    app.use('/typeStand', router);
};