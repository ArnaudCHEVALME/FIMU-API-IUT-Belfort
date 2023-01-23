const {dbNext} = require("../models");
const TypeStand = dbNext.typesStands;

const sequelize = dbNext.sequelize;

// Create and Save a new Stand type
exports.create = async (req, res) => {
    // Create a Stand type
    const typeStand = {
        libelle: req.body.libelle,
    };

    // Save Stand type in the database
    TypeStand.create(typeStand)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the stand type."
            });
        });
};

// Retrieve all Stand types from the database.
exports.findAll = async (req, res) => {
    try{
        let typeStands = await TypeStand.findAll()
        res.send(typeStands);
    }
    catch(e) {
        console.error(e.message)
        res.status(500).send({
            message: "Le server a rencontrer un problème."
        });
    }

};

// Find a single Stand type with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;


    TypeStand.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find stand types with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving TypeStand with id=" + id
            });
        });
};

// Update a Stand type by the id in the request
exports.update = async (req, res) => {
    const id = parseInt(req.params.id);
    const newValues = { libelle: req.body.libelle };


    TypeStand.update(newValues, {
        where: { typeStandId: id }
    })
        .then(results => {
            if (results[0] > 0) {

                res.status(200).send({
                    message: "Type stand was updated successfully.", data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update type stand with id=${id}. Maybe Genre was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating type stand with id=" + id
            });
        });
};

// Delete a Stand type with the specified id in the request
exports.delete = async (req, res) => {
    const id = parseInt(req.params.id);

    TypeStand.destroy({
        where: { typeStandId: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Type stand was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete type stand with id=${id}. Maybe Genre was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete type stand with id=" + id
            });
        });
};

// Delete all Stand types from the database.
exports.deleteAll = async (req, res) => {
    TypeStand.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Type stand were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Type stand."
            });
        });
};
