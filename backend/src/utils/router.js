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
        controller,
        middlewares,
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
    return new RegExp(pattern.replace(/(:\w+)/g, "([0-9a-zA-Z]+)"), "g");
  }

  routeNotFound(res) {
    res.writeHead(404);
    res.end();
  }

  getRouteParamsFromUrl(url, pattern) {
    const props = pattern.match(/(:\w+)/g);
    if (!props) return null;
    const matches = Array.from(url.matchAll(this.patternToRegex(pattern)))[0];
    if (!matches) return null;
    const groups = matches.slice(1);
    if (!groups.length) return null;
    return props.reduce((acc, prop, i) => {
      acc[prop.slice(1)] = groups[i];
      return acc;
    }, {});
  }

  runControllerByRouterMatch(req, res) {
    const url = req.url;
    const method = req.method;

    if (!this.routes[method]) {
      this.routeNotFound(res);
      return;
    }

    const match = this.routes[method].find(({ pattern }) => {
      const matches = url.match(this.patternToRegex(pattern));
      return !!matches && url === matches[0];
    });

    if (!match) {
      this.routeNotFound(res);
      return;
    }
    
    const routeParams = this.getRouteParamsFromUrl(url, match.pattern)
    if (routeParams) req.routeParams = routeParams;

    this.executeRoute(match, req, res);
  }

  async executeRoute(route, req, res) {
    const controller = route.controller;
    const middlewares = this.middlewares.concat(route.middlewares);

    try {
      for (const middleware of middlewares) {
        await middleware(req, res);
      }

      if (controller.length > 1) {
        await controller(req, res);
      } else {
        const result = await controller(req);

        res.write(JSON.stringify(result));
        res.end();
      }
    } catch (e) {
      console.error(e);
      // const [message, status] = await this.errorHandler(req, res, e);

      // res.write(JSON.parse({ message }));
      // res.status = status;
      // res.end();
    }
  }

  handleError(e) {
    
  }

  app(req, res) {
    this.runControllerByRouterMatch(req, res);
  }
}

module.exports = Router;
