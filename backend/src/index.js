const router = require("./routes");

router.use((req, res) => {
  console.log('Global middleware test');
});

const app = router.app.bind(router);

module.exports = app;
