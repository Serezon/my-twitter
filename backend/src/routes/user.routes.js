module.exports = (router) => {
  router.get("/users/:id", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(`User with id ${req.routeParams.id}`);
    res.end();
  });
};
