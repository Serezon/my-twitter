function bodyParse(req) {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    })

    req.on('end', chunk => {
      body += chunk.toString();

      req.body = JSON.parse(body);

      resolve();
    })
  })
}

module.exports = bodyParse;