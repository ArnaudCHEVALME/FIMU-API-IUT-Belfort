const {dbNext} = require("../models");
const LienReseau = dbNext.liensReseaux;


// Create and Save a new Reseau
exports.create = async (req, res) => {
    // Create a Reseau
    const lien = {
        lien: req.body.lien,
        artisteId : req.body.artisteId,
        categorieReseauId : req.body.categorieId,
    };

    // Save Reseau in the database
    LienReseau.create(lien)
        .then(data => {
            res.status(200).send({
                message: `Reseau créé`,
                data: data
            });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Reseau.",
                
            });
        });
};

// Retrieve all Reseaux from the database.
exports.findAll = async (req, res) => {
    const lien = req.query.lien;
    let condition = lien ? { lien: { [Op.iLike]: `%${lien}%` } } : null;

    LienReseau.findAll({ where: condition })
        .then(data => {
            res.status(200).send({
                message: `Réseaux trouvés`,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Reseaux.",
                
            });
        });
};

// Find a single Reseau with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    LienReseau.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Reseau with id=${id}.`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Reseau with id=" + id,
                
            });
        });
};

// Update a Reseau by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const newValues = { lien: req.body.lien };

    LienReseau.update(newValues, {
        where: { id: id }
    })
        .then(results => {
            if (results[0] > 0) {

                res.status(200).send({
                    message: "Reseau was updated successfully.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update Reseau with id=${id}. Maybe Reseau was not found or req.body is empty!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Reseau with id=" + id,
                
            });
        });
};

// Delete a Reseau with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    LienReseau.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Reseau was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Reseau with id=${id}. Maybe Reseau was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Reseau with id=" + id,
                
            });
        });
};

// Delete all Reseaux from the database.
exports.deleteAll = async (req, res) => {
    LienReseau.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Reseaux were deleted successfully!`,
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Reseaux.",
                
            });
        });
};
