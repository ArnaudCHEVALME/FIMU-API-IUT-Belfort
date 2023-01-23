require("dotenv").config();

module.exports = {
    HOST: process.env._FIMU_HOST,
    USER: process.env._FIMU_USER,
    PASSWORD: process.env._FIMU_MDP,
    DB: process.env._FIMU_DB,
    dialect: "postgres",
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
