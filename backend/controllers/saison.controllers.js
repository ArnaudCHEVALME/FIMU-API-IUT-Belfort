const {dbNext} = require("../models");
const Pays = dbNext.pays;
const Saison = dbNext.saisons;
const Stand = dbNext.stands;
const TypeStand = dbNext.typeStand;
const Service = dbNext.services;


// Create and Save a new Saison
exports.create = async (req, res) => {
    // Create a Saison
    const saison = {
        theme: req.body.theme,
        dateSaison: req.body.dateSaison,
        paysHonneurId: req.body.paysHonneurId,
        couleur1: req.body.couleur1,
        couleur2: req.body.couleur2,
        img64: req.body.img64
    };

    console.log(saison)

    // Save Saison in the database
    Saison.create(saison)
        .then(data => {
            res.status(200).send({
                message: `Saison créée`,
                data: data
            });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Saison.",
            });
            res.status(413).send({
                message: err.message || "L'image doit être en dessous de 1 mb",
            });
        });
};

// Retrieve all Saison from the database.
exports.findAll = async (req, res) => {
    Saison.findAll()
        .then(data => {
            res.status(200).send({
                message: `Saisons trouvés`,
                data: data
            });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Saison.",
            });
        });
};

// Find a single Saison with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Saison.findByPk(id, { include: [Pays, Stand] })
        .then(data => {
            if (data) {
                res.status(200).send({
                    message: `Saison trouvé`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Saison with id=${id}.`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Saison with id=" + id,
                
            });
        });
};

// Update a Saison by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const saison = {
        theme: req.body.theme,
        dateSaison: req.body.dateSaison,
        bannierePath: req.body.bannierePath
    };

    Saison.update(saison, {
        where: { saisonId: id }
    })
        .then(results => {
            if (results[0] > 0) {
                res.status(200).send({
                    message: "Saison was updated successfully.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update Saison with id=${id}. Maybe Saison was not found or req.body is empty!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Saison with id=" + id,
                
            });
        });
};

// Delete a Saison with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    Saison.destroy({
        where: { saisonId: id }
    })

        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Saison was deleted successfully!",

                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Saison with id=${id}. Maybe Saison was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Saison with id=" + id,
                
            });
        });
};

// Delete all Saison from the database.
exports.deleteAll = async (req, res) => {
    Saison.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Saison were deleted successfully!`,
                data: nums
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Saison.",
                
            });
        });
};
