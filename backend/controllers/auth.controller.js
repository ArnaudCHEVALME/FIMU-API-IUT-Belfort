const {dbAuth} = require("../models");
const config = require("../config/auth.config");
const User = dbAuth.users;
const Role = dbAuth.roles;



const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

signup = (req, res) => {
    // Save User to Database
    User.create({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    })
        .then(user => {
            if (req.body.roleId && req.body.roleId in [1, 2, 3]) {
                user.setRole(req.body.roleId)
                    .then(() => {
                        res.status(200).send({
                            success: 1,
                            data: user
                        });
                    });
            } else {
                // user role = 1
                user.setRole(1).then(() => {
                    res.status(200).send({
                        success: 1,
                        data: user
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                data: err.message
            });
        });
};
exports.signup = signup

exports.signin = (req, res) => {
    User.findOne({
        where: {
            login: req.body.login
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    success: 0,
                    data: null
                });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({id: user.userId}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            user.getRole().then(role => {
                res.status(200).send({
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    role: role.dataValues.name.toUpperCase(),
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {

    User.findAll({include:Role})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { userId: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "User was deleted successfully!",

                });
            } else {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`,

                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Update a User by the id in the request
exports.update = async (req, res) => {
    const id = parseInt(req.params.id);
    
    const newValues = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        roleId: req.body.roleId.roleId
    };

    User.update(newValues, {
        where: { userId: id }
    })
        .then(results => {
            if (results[0] > 0) {
                
                res.status(200).send({
                    message: "User was updated successfully.", data: results[1]
                });
           }
           else {
                res.status(404).send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};
