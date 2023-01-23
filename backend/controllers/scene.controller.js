const {dbNext} = require("../models");
const Scene = dbNext.scenes;
const sequelize = dbNext.sequelize;


// Create and Save a new scene type
exports.create = async (req, res) => {
    // Create a Scene
    const scene = {
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        nom: req.body.nom,
        capacite: req.body.capacite,
        interieur: req.body.interieur
    };

    // Save Scene in the database
    Scene.create(scene)
        .then(data => {
            res.status(200).send({
                message: `Scene créée`,
                data: data
            });
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Scene.",
                
            });
        });
};

// Retrieve all scene from the database. -> still in progress
exports.findAll = async (req, res) => {

    try{
        let scene = await Scene.findAll()
        res.send(scene)
    } catch (e){
        console.error(e)
        res.status(500).send({
            message: `Le serveur a rencontré une erreur. \n` + e.message,
            data: null
        });
    }
};

// Find a single Scene with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    Scene.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).send({
                    message: `Scene trouvé`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Scene with id=${id}.`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Scene with id=" + id,
                
            });
        });
};

// Update a Scene by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    Scene.update(req.body, {
        where: { sceneId: id }
    })
        .then(results => {
            if (results[0] > 0) {
                res.status(200).send({
                    message: "Scene was updated successfully.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Cannot update Scene with id=${id}. Maybe Scene was not found or req.body is empty!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Scene with id=" + id,

            });
        });
};

// Delete a Scene with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    Scene.destroy({
        where: { sceneId: id }
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "Scene was deleted successfully!",
                    
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Scene with id=${id}. Maybe Scene was not found!`,
                    
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Scene with id=" + id,
                
            });
        });
};

// Delete all Scene from the database.
exports.deleteAll = async (req, res) => {
    Scene.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Scenes were deleted successfully!`,
                data: nums
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Scenes.",
                
            });
        });
};
