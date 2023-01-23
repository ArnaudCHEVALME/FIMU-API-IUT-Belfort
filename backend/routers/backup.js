const {verifySignUp} = require("../middleware");
const auth = require("../middleware/authJwt")
const backup = require("../controllers/backup");
module.exports = app => {
    const router = require("express").Router();

    // Create a new Genre
    router.post("/", backup.create);

    // Retrieve all Genres
    router.get("/", backup.findAll);

    // Create a new Genre
    router.delete("/", backup.deleteAll);

    app.use('/backup', router);
};