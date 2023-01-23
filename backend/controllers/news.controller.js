const {dbNext} = require("../models");
const News = dbNext.news;
const sequelize = dbNext.sequelize;


// Create and Save a new Genre
exports.create = async (req, res) => {

    // Create a Genre
    const news = {
        titre: req.body.titre,
        description: req.body.description,
        publishAt: req.body.publishAt,
    };

    // Save Genre in the database
    News.create(news)
        .then(data => {
            
            res.status(200).send(data);
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({
                message: "données incorrectes : " + err.message,
                data: null
            });
        });
};

// Retrieve all Genres from the database.
exports.findAll = async (req, res) => {

    try {
        let news = await News.findAll();
        res.send(news);
    } catch (e) {
        console.error(e)
        res.status(500).send({
            message: `Le serveur a rencontré une erreur.\n` + e.message,
            data: null
        });
    }
};

// Find a single Genre with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    News.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Pas de News avec id=${id}.`,
                    data: null
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Le serveur a rencontré une erreur pour l'id=${id}.\n` + err.message,
                data: null
            });
        });
};

// Update a Genre by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;
    const newValues =
        {
            titre: req.body.titre,
            description: req.body.description,
            publishAt: req.body.publishAt,
            saisonId: req.query.saisonId
        };

    News.update(newValues, {
        where: {
            newsId: id
        }
    })
        .then(results => {
            if (results[0] > 0) {
                res.status(200).send({
                    message: "News mis à jour.",
                    data: results[1]
                });
            } else {
                res.status(404).send({
                    message: `Pas de news avec id=${id}`,
                    data: null
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `le serveur a rencontré une erreur pour l'id=${id}\n` + err.message,
                data: null
            });
        });
};

// Delete a Genre with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    News.destroy({
        where: {newsId: id}
    })
        .then(num => {
            if (num > 0) {
                res.status(200).send({
                    message: "News a bien été supprimé.",
                    data: null
                });
            } else {
                res.status(404).send({
                    message: `Pas de News avec id=${id}.`,
                    data: null
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: null,
                data: err
            });
        });
};

// Delete all Genres from the database.
exports.deleteAll = async (req, res) => {
    News.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} News ont bien été supprimé.`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: `Le serveur a rencontré une erreur.\n` + err.message,
                data: null
            });
        });
};
