const {authJwt} = require("../middleware");
const sousGenre = require("../controllers/sousGenre.controller");
module.exports = app => {
    const service = require("../controllers/service.controller.js");
    const router = require("express").Router();

    // Create a new service
    router.post("/", [
        authJwt.verifyToken,
        authJwt.isModeratorOrAdmin
    ], service.create);


    // Retrieve all service
    router.get("/", service.findAll);

    // Retrieve a single service with id
    router.get("/:id", service.findOne);

    // Update a service with id
    router.put("/:id", service.update);

    // Delete a service with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], service.delete);

    // Create a new service
    router.delete("/", [authJwt.verifyToken,authJwt.isAdmin],service.deleteAll);

    app.use('/service', router);
};