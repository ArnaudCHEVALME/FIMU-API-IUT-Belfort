const {verifySignUp} = require("../middleware");
const auth = require("../middleware/authJwt")
module.exports = app => {
    const artistes = require("../controllers/artiste.controller.js");
    const router = require("express").Router();

    // Create a new Genre
    router.post("/",[
        auth.verifyToken,
        auth.isModeratorOrAdmin
    ], artistes.create);

    // Retrieve all Genres
    router.get("/", artistes.findAll);

    // Retrieve a single Genre with id
    router.get("/:id", artistes.findOne);

    // Update a Genre with id
    router.put("/:id", artistes.update);

    // Delete a Genre with id
    router.delete("/:id",[
        auth.verifyToken,
        auth.isAdmin
    ], artistes.delete);

    // Create a new Genre
    router.delete("/", [
        auth.verifyToken,
        auth.isAdmin
    ],artistes.deleteAll);

    app.use('/artistes', router);
};