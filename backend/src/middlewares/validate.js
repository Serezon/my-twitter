function validate(schema) {
  return async function validator(req, res) {
    const body = req.body;
    for (const key in schema) {
      
    }
  }
}

module.exports = validate;