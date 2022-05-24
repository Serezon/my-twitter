const http = require("http");
const app = require('./src');

http
  .createServer(app)
  .listen(8888, () => console.log("Server is running on port 8888"));
