const {verifySignUp} = require("../middleware");
const auth = require("../middleware/authJwt")
module.exports = app => {
    const roles = require("../controllers/role.controller.js");
    const router = require("express").Router();

    router.get("/", roles.findAll);

    app.use('/roles', router);

}

