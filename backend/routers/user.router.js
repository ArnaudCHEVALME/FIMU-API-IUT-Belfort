const {authJwt} = require("../middleware")
module.exports = app => {
    const user = require("../controllers/auth.controller.js");
    const router = require("express").Router();

    // Retrieve all Users
    router.get("/", user.findAll);

    // Delete a User with id
    router.delete("/:id", [authJwt.verifyToken,authJwt.isAdmin], user.delete);

    app.use('/users', router);
};
