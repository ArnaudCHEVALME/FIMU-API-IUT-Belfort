const {authJwt} = require("../middleware");
const sousGenre = require("../controllers/sousGenre.controller");
module.exports = app => {
    const stand = require("../controllers/stand.controller.js");
    const router = require("express").Router();

    // Create a new stand
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin], stand.create);


    // Retrieve all stand
    router.get("/", stand.findAll);

    // Retrieve a single stand with id
    router.get("/:id", stand.findOne);

    // Update a stand with id
    router.put("/:id", stand.update);

    // Delete a stand with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], stand.delete);

    // Create a new stand
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin], stand.deleteAll);

    app.use('/stand', router);
};