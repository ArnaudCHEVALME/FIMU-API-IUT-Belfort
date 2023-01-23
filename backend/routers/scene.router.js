const {authJwt} = require("../middleware");
module.exports = app => {
    const scene = require("../controllers/scene.controller.js");
    const router = require("express").Router();

    // Create a new scene
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin], scene.create);

    // Retrieve all scene
    router.get("/", scene.findAll);

    // Retrieve a single scene with id
    router.get("/:id", scene.findOne);

    // Update a scene with id
    router.put("/:id", scene.update);

    // Delete a scene with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], scene.delete);

    // Create a new scene
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin], scene.deleteAll);

    app.use('/scene', router);
};