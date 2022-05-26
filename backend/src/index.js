const router = require("./routes");

router.use((req, res, next) => {
  console.log('Global middleware test');
  next();
});

const app = router.app.bind(router);

module.exports = app;
