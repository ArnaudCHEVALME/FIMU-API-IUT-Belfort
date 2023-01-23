const {dbNext} = require("../models");
const Artiste = dbNext.artistes;
const LienReseau = dbNext.liensReseaux;
const Concert = dbNext.concerts;
const Pays = dbNext.pays;
const Genre = dbNext.genres;
const sousGenre = dbNext.sousGenres;

// Create and Save new Artistes
exports.create = async (req, res) => {

    // Create a new Artistes
    const artisteData = {
        name: req.body.name,
        bio: req.body.bio,
        linkClip: req.body.linkClip,
    };


    // Save Artiste in the database
    try {
        let liens = eval(req.body.liensReseaux)
        let genreIds = dbNext.getIdArray(req.body.genres)
        let sousGenreIds = dbNext.getIdArray(req.body.sousGenres)
        let paysIds = dbNext.getIdArray(req.body.pays)
        let nvArtiste;
        nvArtiste = await Artiste.create(artisteData);
        if (liens) liens.forEach(lien => lien.artisteId = nvArtiste.artisteId)

        if (liens) await dbNext.liensReseaux.bulkCreate(liens)
        if (genreIds) await nvArtiste.setGenres(genreIds)
        if (sousGenreIds) await nvArtiste.setSousGenres(sousGenreIds)
        if (paysIds) await nvArtiste.setPays(paysIds)

        res.status(200).send({success: 1, data: nvArtiste})
    } catch (err) {
        console.error(err)
        await Artiste.destroy({where: {artisteId: nvArtiste.artisteId}});
        return res.status(500).send({
            success: 0,
            data : err.message
        });
    }
};

// Retrieve all Artiste from the database.
exports.findAll = async (req, res) => {

    let options = {
        include: [LienReseau, sousGenre, Genre, Pays]
    }

    try {
        let artistes = await Artiste.findAll(options)
        res.status(200).send({
            success: 1,
            data: artistes
        })
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: 0})
    }
};

// Find a single Artiste with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    Artiste.findByPk(id, {include: [LienReseau, sousGenre, Genre, Pays, Concert]})
        .then(data => {
            if (data) {
                res.status(200).send({success:1,data:data});
            } else {
                res.status(404).send({
                    message: `Pas d'Artiste avec id=${id}.`, data: null
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Le serveur a rencontré une erreur pour l'id=${id}.\n` + err.message, data: null
            });
        });
};


// Update an Artiste by the id in the request
exports.update = async (req, res) => {
    const id = parseInt(req.params.id);

    const newValues = {
        name: req.body.name,
        bio: req.body.bio,
        linkClip: req.body.linkClip,
    };

    let liens = eval(req.body.liensReseaux)
    let genreIds = dbNext.getIdArray(req.body.genres)
    let sousGenreIds = dbNext.getIdArray(req.body.sousGenres)
    let paysIds = dbNext.getIdArray(req.body.pays)
    await Artiste.update(newValues, {
        where: {
            artisteId: id
        },
        returning: true
    })
        .then(async data => {
            if (data[0] > 0) {
                let updtArtiste = await Artiste.findByPk(id)
                updtArtiste.setPays(paysIds)
                updtArtiste.setSousGenres(sousGenreIds)
                updtArtiste.setGenres(genreIds)
                res.status(200).send({
                    message: "Artiste mis à jour.", data: data[1]
                });
            } else {
                res.send.status(404)({
                    message: `Pas de genre avec id=${id}.`, data: null
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Le serveur a rencontré une erreur pour l'id=${id}.\n` + err.message, data: null
            });
        });
};


// Delete an Artiste with the specified id in the request
exports.delete = async (req, res) => {
    const id = parseInt(req.params.id);

    Artiste.destroy({
        where: {artisteId: id}
    })
        .then(num => {
            if (num === 1) {
                res.status(200).send({
                    message: "Artiste a bien été supprimé."
                });
            } else {
                res.send.status(404)({
                    message: `Pas d'artiste avec id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Le serveur a rencontré une erreur pour l'id=${id}.\n` + err.message, data: null
            });
        });
};

// Delete all Artiste from the database.
exports.deleteAll = async (req, res) => {
    Artiste.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({
                message: `${nums} Artistes ont bien été supprimé.`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: `Le serveur a rencontré une erreur.\n` + err.message, data: null
            });
        });
};