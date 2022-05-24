const methods = require("../constants/methods");

class Router {
  routes = {};
  middlewares = [];

  add(method) {
    return (pattern, ...rest) => {
      const middlewares = rest.slice(0, -1);
      const controller = rest[rest.length - 1];

      if (!this.routes[method]) this.routes[method] = [];
      this.routes[method].push({
        pattern,
        controller: (req, res) => {
          const wrapped = this.composeMiddlewares(
            middlewares,
            () => controller(req, res),
            req,
            res
          );
          wrapped[wrapped.length - 1]();
        },
      });
      return this;
    };
  }

  get = this.add(methods.GET);
  post = this.add(methods.POST);
  put = this.add(methods.PUT);
  patch = this.add(methods.PATCH);
  del = this.add(methods.DELETE);

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  patternToRegex(pattern) {
    return new RegExp(pattern.replace(/(:\w+)/, "((\\d+|\\w+)+)"), "g");
  }

  routeNotFound(res) {
    res.writeHead(404);
    res.end();
  }

  runControllerByRouterMatch(req, res) {
    const url = req.url;
    const method = req.method;

    if (!this.routes[method]) {
      this.routeNotFound(res);
      return;
    }

    const match = this.routes[method].find(({ pattern }) => {
      const matches = url.match(this.patternToRegex(pattern))
      return !!matches && url === matches[0];
    });

    if (!match) {
      this.routeNotFound(res);
      return;
    }

    match.controller(req, res);
  }

  composeMiddlewares(middlewares, initialFn, req, res) {
    return middlewares.reduceRight(
      (acc, x) => {
        const prevIndex = acc.length - 1;
        acc.push(() => x(req, res, acc[prevIndex]));
        return acc;
      },
      [initialFn]
    );
  }

  app(req, res) {
    const middlewares = this.composeMiddlewares(
      this.middlewares,
      () => this.runControllerByRouterMatch(req, res),
      req,
      res
    );

    middlewares[middlewares.length - 1]();
  }
}

module.exports = Router;
