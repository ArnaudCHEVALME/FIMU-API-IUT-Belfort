const auth = require("../middleware/authJwt");
module.exports = app => {
    const concerts = require("../controllers/concert.controller.js");
    const router = require("express").Router();

    // Create a new Concert
    router.post("/", [
        auth.verifyToken,
        auth.isModeratorOrAdmin
    ], concerts.create);

    // Retrieve all Concerts
    router.get("/", concerts.findAll);

    // Retrieve a single Concert with id
    router.get("/:id", concerts.findOne);

    // Update a Concert with id
    router.put("/:id", concerts.update);

    // Delete a Concert with id
    router.delete("/:id", [auth.verifyToken,auth.isAdmin], concerts.delete);

    // Create a new Concert
    router.delete("/", [auth.verifyToken,auth.isAdmin], concerts.deleteAll);

    app.use('/concerts', router);
};