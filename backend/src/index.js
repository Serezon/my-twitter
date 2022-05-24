const Router = require("./utils/router");

const router = new Router();

router.use((req, res, next) => {
  console.log(1);
  next();
});

router.use((req, res, next) => {
  console.log(2);
  next();
});

router.get("/abc/:id", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Plain text btw");
  res.end();
});

const app = router.app.bind(router);

module.exports = app;
