const auth = require("../middleware/authJwt");
module.exports = app => {
    const categoriesReseaux = require("../controllers/categorieReseau.controller");
    const router = require("express").Router();

    // Create a new CategorieLien
    router.post("/", [
        auth.verifyToken,
        auth.isModeratorOrAdmin
    ],  categoriesReseaux.create);

    // Retrieve all CategorieLiens
    router.get("/", categoriesReseaux.findAll);

    // Retrieve a single CategorieLien with id
    router.get("/:id", categoriesReseaux.findOne);

    // Update a CategorieLien with id
    router.put("/:id", categoriesReseaux.update);

    // Delete a CategorieLien with id
    router.delete("/:id", [auth.verifyToken,auth.isAdmin], categoriesReseaux.delete);

    // Create a new CategorieLien
    router.delete("/",[auth.verifyToken,auth.isAdmin], categoriesReseaux.deleteAll);

    app.use('/categoriesReseaux', router);
};