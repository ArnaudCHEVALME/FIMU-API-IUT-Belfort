const auth = require("../middleware/authJwt");
const genres = require("../controllers/genre.controller");
module.exports = app => {
    const genres = require("../controllers/genre.controller.js");
    const router = require("express").Router();

    // Create a new Genre
    router.post("/",[
        auth.verifyToken,
        auth.isModeratorOrAdmin
    ], genres.create);


    // Retrieve all Genres
    router.get("/", genres.findAll);

    // Retrieve a single Genre with id
    router.get("/:id", genres.findOne);

    // Update a Genre with id
    router.put("/:id", [auth.verifyToken, auth.isModeratorOrAdmin], genres.update);

    // Delete a Genre with id
    router.delete("/:id", [auth.verifyToken,auth.isAdmin], genres.delete);

    // Create a new Genre
    router.delete("/",[auth.verifyToken,auth.isAdmin], genres.deleteAll);

    app.use('/genres', router);
};