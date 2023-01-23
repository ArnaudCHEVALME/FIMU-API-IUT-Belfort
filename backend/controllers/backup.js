const {dbBack, dbNext} = require("../models");
const {dbCur} = require("../models");
const {logger} = require("sequelize/lib/utils/logger");
const sequelize = dbBack.sequelize;
const ArtisteBackup = dbBack.artistes;
const LienReseau = dbBack.liensReseaux;
const CategoriesReseaux = dbBack.categoriesReseaux;
const Concert = dbBack.concerts;
const Saison = dbBack.saisons;
const Pays = dbBack.pays;
const Genre = dbBack.genres;
const sousGenre = dbBack.sousGenres;


const Artistes = dbCur.artistes;
const liensReseaux = dbCur.liensReseaux;
const genres = dbCur.genres;
const sousgenres = dbCur.sousGenres;
const pays = dbCur.pays;


function parse(res){
    return res.map(e =>  e.dataValues)
}

function parsePays(res){
    res.paysId =  res.dataValues.paysId
    return res
}

async function curToBackup(){
    let paysBack = null
    let saisonBack = null
    let categorieReseauxBack = null

    let pays = parse(await dbCur.pays.findAll())
    if(pays)  paysBack = await Pays.bulkCreate(pays, {returning: true, ignoreDuplicates: true})

    let saison = parse(await dbCur.saisons.findAll())
    if(saison) saisonBack = await Saison.bulkCreate(saison, {returning: true})

    let categorieReseaux = parse(await dbCur.categoriesReseaux.findAll())
    if(categorieReseaux) categorieReseauxBack = await CategoriesReseaux.bulkCreate(categorieReseaux, {returning: true})

    let artistes =  parse(await dbCur.artistes.findAll({include: [dbCur.liensReseaux, dbCur.sousGenres, dbCur.genres, dbCur.pays]}))
    if(artistes) artistes.forEach( artiste => {
        let paysIds = artiste.pays.map(p => p.paysId)
        artiste.saisonId = saisonBack[0].dataValues.saisonId
        dbBack.artistes.create(artiste, {include: [dbBack.liensReseaux, dbBack.sousGenres, dbBack.genres], returning: true, ignoreDuplicates: true})
            .then(artisteBack =>{
                artisteBack.setPays(paysIds)
            })
    })
    await Promise.all([
        dbCur.concerts.destroy({
            where: {},
            truncate: false
        }),
        dbCur.scenes.destroy({
            where: {},
            truncate: false
        }),
        dbCur.artistes.destroy({
            where: {},
            truncate: false
        }),
        dbCur.liensReseaux.destroy({
            where: {},
            truncate: false
        }),
        dbCur.news.destroy({
            where: {},
            truncate: false
        }),
        dbCur.stands.destroy({
            where: {},
            truncate: false
        }),
        dbCur.typesStands.destroy({
            where: {},
            truncate: false
        }),
        dbCur.services.destroy({
            where: {},
            truncate: false
        }),
        dbCur.saisons.destroy({
            where: {},
            truncate: false
        })]
    )
}

async function nextToCur(){
    let payscurr = null
    let saisonCur = null
    let newsCurr = null
    let scenesCur = null
    let concertsCur = null
    let typeStandCur = null
    let servicesCur = null

    let pays = parse(await dbNext.pays.findAll())
    if(pays) payscurr = await dbCur.pays.bulkCreate(pays, {returning: true, ignoreDuplicates: true})

    let saison = parse(await dbNext.saisons.findAll())
    if(saison) saisonCur = await dbCur.saisons.bulkCreate(saison, {returning: true})

    let categorieReseaux = parse(await dbNext.categoriesReseaux.findAll())
    if(categorieReseaux) categorieReseauxCur = await dbCur.categoriesReseaux.bulkCreate(categorieReseaux, {returning: true, ignoreDuplicates: true})

    let artistes =  parse(await dbNext.artistes.findAll({include: [dbNext.liensReseaux, dbNext.sousGenres, dbNext.genres, dbNext.pays]}))
    if(artistes) artistes.forEach( artiste => {
        let paysIds = artiste.pays.map(p => p.paysId)
        artiste.saisonId = saisonCur[0].dataValues.saisonId
        dbCur.artistes.create(artiste, {include: [dbCur.liensReseaux, dbCur.sousGenres, dbCur.genres], returning: true, ignoreDuplicates: true})
            .then(artisteCur =>{
                artisteCur.setPays(paysIds)
            })
    })

    let news = parse(await dbNext.news.findAll())
    if(news) newsCurr = await dbCur.news.bulkCreate(news, {returning: true})

    let scenes = parse(await dbNext.scenes.findAll())
    if(scenes) scenesCur = await dbCur.scenes.bulkCreate(scenes, {returning: true})

    let concerts = parse(await dbNext.concerts.findAll())
    if(concerts) concertsCur = await dbCur.concerts.bulkCreate(concerts, {returning: true})

    let typeStand = parse(await dbNext.typesStands.findAll())
    if(typeStand) typeStandCur = await dbCur.typesStands.bulkCreate(typeStand, {returning: true})

    let services = parse(await dbNext.services.findAll())
    if(services) servicesCur = await dbCur.services.bulkCreate(services, {returning: true})

    let stands = parse(await dbNext.stands.findAll({include: dbNext.services}))
    if(stands) stands.forEach(stand => {
        let servicesIds = stand.services.map(p => p.serviceId)
        dbCur.stands.create(stand, {returning: true})
            .then(standCur =>{
                standCur.setServices(servicesIds)
            })
    })

    await Promise.all([
        dbNext.concerts.destroy({
            where: {},
            truncate: false
        }),
        dbNext.scenes.destroy({
            where: {},
            truncate: false
        }),
        dbNext.artistes.destroy({
            where: {},
            truncate: false
        }),
        dbNext.liensReseaux.destroy({
            where: {},
            truncate: false
        }),
        dbNext.news.destroy({
            where: {},
            truncate: false
        }),
        dbNext.stands.destroy({
            where: {},
            truncate: false
        }),
        dbNext.typesStands.destroy({
            where: {},
            truncate: false
        }),
        dbNext.services.destroy({
            where: {},
            truncate: false
        }),
        dbNext.saisons.destroy({
            where: {},
            truncate: false
        })]
    )
}

exports.create = async (req, res) => {
    try{

        curToBackup().then( p => {
            nextToCur()
        })

        res.status(200).send({message: "la saison à  bien été transféré dans la backup!"})
    }catch (e) {
        console.error(e)
        res.status(500).send(e)
    }
};

// Retrieve all Artiste from the database.
exports.findAll = async (req, res) => {

    let options = {
        include: [LienReseau, sousGenre, Genre, Pays]
    }

    try {
        let artistes = await ArtisteBackup.findAll(options)
        res.status(200).send({
            success: 1,
            data: artistes
        })
    } catch (e) {
        console.error(e.message)
        res.status(500).send({success: 0})
    }
};


// Delete all Artiste from the database.
exports.deleteAll = async (req, res) => {
    ArtisteBackup.destroy({
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