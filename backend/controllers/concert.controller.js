const {dbNext} = require("../models");
const Concert = dbNext.concerts;
const Artiste = dbNext.artistes;
const Genre = dbNext.genres;
const SousGenre = dbNext.sousGenres;
const Pays = dbNext.pays;
const Scene = dbNext.scenes;


// Create and Save a new Concert
exports.create = async (req, res) => {
    // Create a Concert
    const concert = {
        debut: req.body.debut   ,
        heure: req.body.heure   ,
        duree: parseInt(req.body.duree),
        sceneId: req.body.sceneId,
        artisteId: req.body.artisteId,
        saisonId: req.body.saisonId
    };


    // Save Concert in the database
    Concert.create(concert)
        .then(concert => {
            res.status(200).send({
                msg: `Concert créé avec succès`,
                success: 1,
                data: concert
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                success: 0,
                msg: "Le serveur a rencontré une erreur",
            })
        })
};


// Retrieve all Concerts from the database. => WIP maybe middleware
exports.findAll = async (req, res) => {
    Concert.findAll({include:[Scene,
            {
                model:Artiste,
                include: [Genre, SousGenre, Pays]
            }
        ]})
        .then(concerts => {
            res.status(200).send({
                data: concerts,
                success:1
            });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({success:0});
        });
}


// Find a single Concert with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Concert.findByPk(id,{include:[Scene,
            {
                model:Artiste,
                include: [Genre, SousGenre, Pays]
            }
        ]})
        .then(data => {
            if (data) {
                res.status(200).send({
                    data: data,
                    success:1
                });
            } else {
                res.status(404).send({
                    success:1,
                    msg: `Cannot find Concert with id=${id}.`,
                });
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                msg: "Error retrieving Concert with id=" + id,
                success:0
            });
        });
};

// Update a Concert by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    Concert.update(req.body, {
        where: {concertId: id}
    })
        .then(results => {
            if (results[0] > 0) {

                res.status(200).send({
                    message: "Concert was updated successfully.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update Concert with id=${id}. Maybe Concert was not found or req.body is empty!`,

                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Concert with id=" + id,

            });
        });
};

// Delete a Concert with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    Concert.destroy({
        where: {concertId: id}
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Concert was deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Concert with id=${id}. Maybe Concert was not found!`
                });
            }
        })
        .catch(err => {
            console.error(err.message)
            res.status(500).send({
                message: "Could not delete Concert with id=" + id,

            });
        });
};

// Delete all Concerts from the database.
exports.deleteAll = async (req, res) => {
    Concert.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Concerts were deleted successfully!`,
                data: nums
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Concerts.",

            });
        });
};
