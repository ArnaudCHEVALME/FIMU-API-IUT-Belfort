const {dbNext} = require("../models");
const Pays = dbNext.pays;

// Create and Save a new Pays
exports.create = async (req, res) => {
    // Create a Pays
    const pays = {
        nompays: req.body.nompays,
    };

    // Save Pays in the database
    Pays.create(pays)
        .then(data => {
            res.status(200).send({
                message: `Pays créé`,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Pays.",
                
            });
        });
};

// Retrieve all Pays from the database.
exports.findAll = async (req, res) => {
    try {
        let news = await Pays.findAll()
        res.send(news);
    } catch (e) {
        res.status(500).send({
            message: `Le serveur a rencontré une erreur.\n` + e.message,
            data: null
        });
    }
};

// Find a single Pays with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Pays.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).send({
                    message: `Pays trouvé`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Pays with id=${id}.`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Pays with id=" + id,
                
            });
        });
};

// Update a Pays by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    const newNomPays = { nompays: req.body.nompays };

    Pays.update(newNomPays, {
        where: { paysId: id }
    })
        .then(results => {
            if (results[0] > 0) {
                res.status(200).send({
                    message: "Pays was updated successfully.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update Pays with id=${id}. Maybe Pays was not found or req.body is empty!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Pays with id=" + id,
                
            });
        });
};

// Delete a Pays with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    Pays.destroy({
        where: { paysId: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Pays was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Pays with id=${id}. Maybe Pays was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Pays with id=" + id,
                
            });
        });
};

// Delete all Pays from the database.
exports.deleteAll = async (req, res) => {
    Pays.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Pays were deleted successfully!`,
                data: nums
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Pays.",
            });
        });
};
