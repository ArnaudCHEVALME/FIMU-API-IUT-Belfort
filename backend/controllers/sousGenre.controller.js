const {dbNext} = require("../models");
const SousGenre = dbNext.sousGenres;


// Create and Save a new Subgenre
exports.create = async (req, res) => {
    // Create a SubGenre
    const sousGenre = {
        libelle: req.body.libelle
    };

    // Save Subgenre in the database
    SousGenre.create(sousGenre)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the subgenre."
            });
        });
};

// Retrieve all subgenres from the database.
exports.findAll = async (req, res) => {

    try{
        let sousGenres = await SousGenre.findAll()
        res.status(200).send(sousGenres);
    } catch (e) {
        console.error(e)
        res.status(500).send({
            message: `Le serveur a rencontré une erreur. \n` +e.message,
        });
    }
};

// Find a single subgenre with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    SousGenre.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data)
            } else {
                res.status(404).send({
                    message: `Cannot find subgenre with id=${id}.`
                });
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: "Error retrieving subgenre with id=" + id
            });
        });
};

// Update a subgenre by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    // const newValues = { libelle: req.body.libelle, genreId: req.body.genreId };

    SousGenre.update(req.body, {
        where: { sousGenreId: id }
    })
        .then(results => {
            if (results[0] > 0) {

                res.status(200).send({
                    message: "Subgenre was updated successfully.", data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update subgenre with id=${id}. Maybe Genre was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Subgenre with id=" + id
            });
        });
};

// Delete a Genre with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    SousGenre.destroy({
        where: { sousGenreId: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Subgenre was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Subgenre with id=${id}. Maybe SubGenre was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Subgenre with id=" + id
            });
        });
};

// Delete all Subgenres from the database.
exports.deleteAll = async (req, res) => {
    SousGenre.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Subgenre were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Subgenres."
            });
        });
};
