const {dbAuth} = require("../models");
const Role = dbAuth.roles;


// Create and Save a new Role
exports.create = async (req, res) => {
    // Create a Role
    const role = {
        libelle: req.body.libelle,
    };

    // Save Role in the database
    Role.create(role)
        .then(data => {
            res.status(200).send({
                success:1,
                message: `Role créé`,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Role.",
                
            });
        });
};

// Retrieve all Roles from the database.
exports.findAll = async (req, res) => {
    Role.findAll()
        .then(data => {
            res.status(200).send({
                message: `Roles trouvés`,
                data: data
            });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Roles.",
                
            });
        });
};

// Find a single Role with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Role.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).send({
                    message: `Role trouvé`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Role with id=${id}.`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Role with id=" + id,
                
            });
        });
};

// Update a Role by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    Role.update(req.body, {
        where: { id: id }
    })
        .then(results => {
            if (results[0] > 0) {
                res.status(200).send({
                    message: "Role was updated successfully.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Role with id=" + id,
                
            });
        });
};

// Delete a Role with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    Role.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Role was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Role with id=${id}. Maybe Role was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Role with id=" + id,
                
            });
        });
};

// Delete all Roles from the database.
exports.deleteAll = async (req, res) => {
    Role.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Roles were deleted successfully!`,
                data: nums
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Roles.",
                
            });
        });
};
