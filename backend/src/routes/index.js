const Router = require("../utils/router");

const userRoutes = require("./user.routes");

const router = new Router();

userRoutes(router);

module.exports = router;
