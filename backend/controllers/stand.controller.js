const {dbNext} = require("../models");
const sequelize = dbNext.sequelize;
const Stand = dbNext.stands;

const TypeStand = dbNext.typesStands;
const Service = dbNext.services;
const Saison = dbNext.saisons;

// Create and Save a new Stand type
exports.create = async (req, res) => {
    // Create a Stand
    const stand = {
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        nom: req.body.nom,
        typeStandId: req.body.typeStandId,
    };


    let serviceIds = dbNext.getIdArray(req.body.serviceIds)

    // Save Stand in the database
    let result;
    let msg = "Stand crée"
    let code = 200;
    try {
        result = await Stand.create(stand)
        if (serviceIds) {
            result.setServices(serviceIds)
        }
    } catch (err) {
        console.error(err)
        msg = "Le serveur a rencontré une erreur"
        code = 500;
        result = null;
    }
    res.status(code).send({
        message: msg,
        data: result
    });
};

// Retrieve all Stands from the database.-> still in progress
exports.findAll = async (req, res) => {
    try {
        let stand = await Stand.findAll({include: [TypeStand, Service]})
        res.status(200).send(stand)
    } catch (e) {
        console.error(e)
        res.status(500).send({
            message: "Le server a rencontré un problème."
        });
    }
};

// Find a single Stand with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Stand.findByPk(id, {include: [TypeStand, Service]})
        .then(data => {
            if (data) {
                res.status(200).send({
                    message: null, data: data
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Stand!`,

                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Stand!",
            });
        });
};

// Update a Stand by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    // Create a Stand
    const stand = {
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        nom: req.body.nom,
        typeStandId: req.body.typeStandId,
        saisonId: req.query.saisonId
    };
    // Update Stand in the database
    let msg, updatedStand, results, code;
    try {
        results = await Stand.update(stand, {where: {standId: id}})
        msg = results[0] > 0 ? "Stand mis à jour" : "Pas de stand trouvé avec l'identifiant " + id;
        updatedStand = results[0] > 0 ? await Stand.findByPk(id) : null;
        code = results[0] > 0 ? 200 : 404

        if (req.body.serviceIds && results[0] > 0) { // check if a stand was updated. Should be 1
            await updatedStand.setServices(eval(req.body.serviceIds))
        }
    } catch (e) {
        msg = "le serveur a rencontré une erreur"
        code = 500
        console.error(e)
    }
    res.status(code).send({
        message: msg,
        data: null
    })
};

// Delete a Stand with the specified id in the request
exports.delete = async (req, res) => {

    Stand.destroy({
        where: {standId: req.params.id}
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Poi was deleted successfully!",

                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Poi with id=${id}. Maybe Poi was not found!`,

                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Cannot find Stand: ${err.message}`,

            });
        });
};

// Delete all Stand from the database.
exports.deleteAll = async (req, res) => {
    Stand.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `Stands were deleted successfully!`,
                data: nums
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing Stands.",

            });
        });
};
