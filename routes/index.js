const bodyParser = require("body-parser");
const flow = require("../controllers/flow");

var jsonParser = bodyParser.json();

module.exports = function routes(app) {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome API!",
    })
  );

  app.get("/api/flow", (req, res) => flow.get(req, res));
  app.post("/api/flow/add", jsonParser, (req, res) => flow.add(req, res));
  app.post("/api/flow/update", jsonParser, (req, res) => flow.update(req, res));
  app.delete("/api/flow/delete/:id", jsonParser, (req, res) => flow.delete(req, res));
};
