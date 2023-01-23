const express = require("express");
const app = express();
const cors = require("cors");

const bodyParser = require('body-parser');

// Express 4.0
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');

const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, './.env')
})

// set port, listen for requests
const PORT = process.env._FIMU_PORT;
const HOST = process.env._FIMU_HOST;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//     res.header(
//         "Access-Control-Allow-Headers",
//         "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
// });


app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Use routes defined in backend/routers
require("./backend/routers/artiste.router")(app);
require("./backend/routers/categorieReseau.router")(app);
require("./backend/routers/concert.router")(app);
require("./backend/routers/genre.router")(app);
require("./backend/routers/typeStand.router")(app);
require("./backend/routers/service.router")(app);
require("./backend/routers/pays.router")(app);
require("./backend/routers/stand.router")(app);
require("./backend/routers/lienReseau.router")(app);
require("./backend/routers/saison.router")(app);
require("./backend/routers/scene.router")(app);
require("./backend/routers/service.router")(app);
require("./backend/routers/sousGenre.router")(app);
require("./backend/routers/typeStand.router")(app);
require("./backend/routers/user.router")(app);
require("./backend/routers/news.router")(app);
require("./backend/routers/roles.router")(app);
require('./backend/routers/auth.routes')(app);
require('./backend/routers/backup')(app);
require('./backend/routers/import.router')(app);


const swaggerDocument = YAML.load('./backend/config/swagger-config.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`http://${HOST}:${PORT}.`);
});
