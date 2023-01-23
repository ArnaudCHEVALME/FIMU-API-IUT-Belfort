const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const ROLES = [
    {
        name: "stagiaire"
    },
    {
        name: "admin"
    },
    {
        name: "moderator"
    }];

const PERMS = [{libelle: "edit"}, {libelle: "create"}, {libelle: "delete"}]

function createSchemaIfNotExists(sequelize, schema){
    sequelize.createSchema(schema).then(() =>{
        console.log(`schema "${schema}" créé`)
    }).catch(()=>{
        console.log(`schema "${schema}" existe déjà`)
    })
}

function syncModelsSchema(schema) {
    let dbObj = {};
    const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        schema: schema,
        define: {
            timestamps: false
        },
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    });

    dbObj.sequelize = sequelize;
    dbObj.Sequelize = Sequelize;

    createSchemaIfNotExists(sequelize, schema)

    dbObj.artistes = require("./artiste.model.js")(sequelize, Sequelize, schema)
    dbObj.categoriesReseaux = require("./categorieReseau.model.js")(sequelize, Sequelize, schema)
    dbObj.concerts = require("./concert.model.js")(sequelize, Sequelize, schema)
    dbObj.saisons = require("./saison.model.js")(sequelize, Sequelize, schema)
    dbObj.genres = require("./genre.model.js")(sequelize, Sequelize, schema)
    dbObj.liensReseaux = require("./lienReseau.model.js")(sequelize, Sequelize, schema)
    dbObj.pays = require("./pays.model.js")(sequelize, Sequelize, schema)
    dbObj.services = require("./service.model")(sequelize, Sequelize, schema)
    dbObj.scenes = require("./scene.model.js")(sequelize, Sequelize, schema)
    dbObj.stands = require("./stand.model.js")(sequelize, Sequelize, schema)
    dbObj.sousGenres = require("./sousGenre.model")(sequelize, Sequelize, schema)
    dbObj.typesStands = require("./typeStand.model.js")(sequelize, Sequelize, schema)
    dbObj.news = require("./news.model.js")(sequelize, Sequelize, schema)


    // 1 saison a plusieurs News
    // 1 News peut appartenir à plusieurs saisons
    // dbObj.news.belongsTo(dbObj.saisons, {foreignKey: "saisonId"});
    // dbObj.saisons.hasMany(dbObj.news, {foreignKey: "saisonId"});

    // 1 lienReseau a 1 seul artiste
    // 1 artiste a plusieurs liensReseaux
    dbObj.liensReseaux.belongsTo(dbObj.artistes, {foreignKey: "artisteId"});
    dbObj.artistes.hasMany(dbObj.liensReseaux, {foreignKey: "artisteId"});

    // 1 saison a 1 seul pays à l'honneur
    // 1 pays est à l'honneur dans plusieurs saisons
    dbObj.saisons.belongsTo(dbObj.pays, {foreignKey: "paysHonneurId"});
    dbObj.pays.hasMany(dbObj.saisons, {foreignKey: "paysHonneurId"});

    dbObj.artistes.belongsToMany(dbObj.pays, {through: "OriginesArtistes", foreignKey: "artisteId"});
    dbObj.pays.belongsToMany(dbObj.artistes, {through: "OriginesArtistes", foreignKey: "paysId"});

    //1 stand appartient 1 saison
    //1 saison a plusieurs stands
    dbObj.stands.belongsTo(dbObj.saisons, {foreignKey: "saisonId"});
    dbObj.saisons.hasMany(dbObj.stands, {foreignKey: "saisonId"});

    //* ARTISTES *//
    // 1 artiste peut avoir n sous-genres
    // 1 sous-genre peut être lié à n artistes
    dbObj.artistes.belongsToMany(dbObj.sousGenres, {through: "ArtistesSousGenres", foreignKey: "artisteId"});
    dbObj.sousGenres.belongsToMany(dbObj.artistes, {through: "ArtistesSousGenres", foreignKey: "sousGenreId"});

    // 1 artiste peut avoir n sous-genres
    // 1 sous-genre peut être lié à n artistes
    dbObj.artistes.belongsToMany(dbObj.genres, {through: "ArtistesGenres", foreignKey: "artisteId"});
    dbObj.genres.belongsToMany(dbObj.artistes, {through: "ArtistesGenres", foreignKey: "genreId"});

    // 1 concert a un seul artiste
    // 1 artiste participe à plusieurs concerts
    dbObj.concerts.belongsTo(dbObj.artistes, {foreignKey: "artisteId"});
    dbObj.artistes.hasMany(dbObj.concerts, {foreignKey: "artisteId"});

    // 1 concert a une seule scène
    // 1 scène appartient à plusieurs concerts
    dbObj.concerts.belongsTo(dbObj.scenes, {foreignKey: "sceneId"});
    dbObj.scenes.hasMany(dbObj.concerts, {foreignKey: "sceneId"});

    // // 1 concert appartient à une seule saison
    // // 1 saison a plusieurs concerts
    // dbObj.concerts.belongsTo(dbObj.saisons, {foreignKey: "saisonId"});
    // dbObj.saisons.hasMany(dbObj.concerts, {foreignKey: "saisonId"});

    // 1 lien a 1 seule catégorie
    // 1 catégorie de lien est utilisée par n liens
    dbObj.liensReseaux.belongsTo(dbObj.categoriesReseaux, {foreignKey: "categorieReseauId"});
    dbObj.categoriesReseaux.hasMany(dbObj.liensReseaux, {foreignKey: "categorieReseauId"});

    // 1 stand a un seul type de stand
    // 1 type de stand appartient à plusieurs stands
    dbObj.stands.belongsTo(dbObj.typesStands, {foreignKey: "typeStandId"});
    dbObj.typesStands.hasMany(dbObj.stands, {foreignKey: "typeStandId"});

    // 1 stand a plusieurs services
    // 1 service est proposé par plusieurs stands
    dbObj.stands.belongsToMany(dbObj.services, {through: "StandsServices", foreignKey: "standId"});
    dbObj.services.belongsToMany(dbObj.stands, {through: "StandsServices", foreignKey: "serviceId"});

    dbObj.getIdArray = function (txt) {
        if (txt == null) return;
        let arr = (txt.toString()).split("|")
        return arr.map(i => parseInt(i))
    }

    dbObj.sequelize.sync({logging:false}).then(()=>{
        console.log(schema+" synced")
        
        // TODO - charger tout les pays par défaut dans un schéma à part
        dbObj.pays.bulkCreate([
            {nompays:"France"},
            {nompays:"Italie"},
            {nompays:"Suisse"},
            {nompays:"Allemagne"},
            {nompays:"Ukraine"},
        ],
            {ignoreDuplicates:true})
    }).catch(err=> console.error(err))
    return dbObj;
}

let dbAuth = {}
dbAuth.sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    schema: 'auth',
    define: {
        timestamps: false
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

createSchemaIfNotExists(dbAuth.sequelize, 'auth')

dbAuth.permissions = require("./permission.model")(dbAuth.sequelize, Sequelize, 'auth')
dbAuth.roles = require("./role.model")(dbAuth.sequelize, Sequelize, 'auth')
dbAuth.users = require("./user.model")(dbAuth.sequelize, Sequelize, 'auth')

// 1 user a 1 seul role
// 1 role est partagé par plusieurs users
dbAuth.users.belongsTo(dbAuth.roles, {foreignKey: "roleId"});
dbAuth.roles.hasMany(dbAuth.users, {foreignKey: "roleId"});

// 1 role a plusieurs permissions
// 1 permission est utilisée par plusieurs rôles
dbAuth.permissions.belongsToMany(dbAuth.roles, {through: "roles_perms", foreignKey: "permId"});
dbAuth.roles.belongsToMany(dbAuth.permissions, {through: "roles_perms", foreignKey: "roleId"});

dbAuth.PERMS = PERMS
dbAuth.ROLES = ROLES
dbAuth.sequelize.sync({logging: false}).then(async ()=>{
    await dbAuth.roles.bulkCreate(ROLES, {ignoreDuplicates: true})
    await dbAuth.permissions.bulkCreate(PERMS, {ignoreDuplicates: true})
    await dbAuth.roles.findByPk(1).then(role => role.setPermissions([1]))
    await dbAuth.roles.findByPk(2).then(role => role.setPermissions([1, 2, 3]))
    await dbAuth.roles.findByPk(3).then(role => role.setPermissions([1, 2]))
    console.log("auth synced")
})

let dbBack = {};
let shemaBackup = 'backup'
const sequelizeBack = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    schema: shemaBackup,
    define: {
        timestamps: false
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

dbBack.sequelize = sequelizeBack;
dbBack.Sequelize = Sequelize;
dbBack.artistes = require("./artiste.model.js")(dbBack.sequelize, Sequelize, shemaBackup);
dbBack.genres = require("./genre.model.js")(dbBack.sequelize, Sequelize, shemaBackup);
dbBack.sousGenres = require("./sousGenre.model.js")(dbBack.sequelize, Sequelize, shemaBackup);
dbBack.pays = require("./pays.model.js")(dbBack.sequelize, Sequelize, shemaBackup);
dbBack.saisons = require("./saison.model.js")(dbBack.sequelize, Sequelize, shemaBackup);
dbBack.liensReseaux = require("./lienReseau.model.js")(dbBack.sequelize, Sequelize, shemaBackup);
dbBack.categoriesReseaux = require("./categorieReseau.model.js")(dbBack.sequelize, Sequelize, shemaBackup);


dbBack.artistes.belongsToMany(dbBack.sousGenres, {through: "ArtistesSousGenres", foreignKey: "artisteId"});
dbBack.sousGenres.belongsToMany(dbBack.artistes, {through: "ArtistesSousGenres", foreignKey: "sousGenreId"});


dbBack.artistes.belongsToMany(dbBack.genres, {through: "ArtistesGenres", foreignKey: "artisteId"});
dbBack.genres.belongsToMany(dbBack.artistes, {through: "ArtistesGenres", foreignKey: "genreId"});


dbBack.artistes.belongsToMany(dbBack.pays, {through: "OriginesArtistes", foreignKey: "artisteId"});
dbBack.pays.belongsToMany(dbBack.artistes, {through: "OriginesArtistes", foreignKey: "paysId"});


dbBack.liensReseaux.belongsTo(dbBack.artistes, {foreignKey: "artisteId"});
dbBack.artistes.hasMany(dbBack.liensReseaux, {foreignKey: "artisteId"});


dbBack.artistes.belongsTo(dbBack.saisons, {foreignKey: "saisonId"});
dbBack.saisons.hasMany(dbBack.artistes, {foreignKey: "saisonId"});


dbBack.liensReseaux.belongsTo(dbBack.categoriesReseaux, {foreignKey: "categorieReseauId"});
dbBack.categoriesReseaux.hasMany(dbBack.liensReseaux, {foreignKey: "categorieReseauId"});


dbBack.saisons.belongsTo(dbBack.pays, {foreignKey: "paysHonneurId"});
dbBack.pays.hasMany(dbBack.saisons, {foreignKey: "paysHonneurId"});

createSchemaIfNotExists(dbBack.sequelize, shemaBackup);

dbBack.sequelize.sync({logging: false}).then(async ()=>{
    console.log("backup synced")
})

let dbCur = syncModelsSchema('cur_saison')
let dbNext = syncModelsSchema('next_saison')

module.exports = {dbCur, dbNext, dbAuth, dbBack};

