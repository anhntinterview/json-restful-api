const fs = require("fs");

class Core {

  constructor(path) {
    this.path = path;
  }

  readJSON = () => fs.readFileSync(this.path);

  writeJSON = (strData) => fs.writeFileSync(this.path, strData);

  saveData = (data) => {
    const stringifyData = JSON.stringify(data);
    this.writeJSON(stringifyData);
  };

  getData = () => JSON.parse(this.readJSON(this.path));

  // GET
  get(req, res) {
    const data = this.getData();
    res.status(200).send(data);
  }
  // POST
  add(req, res) {
    const existData = this.getData();
    //get the new user data from post request
    const bodyData = req.body;
    // check if the bodyData fields are missing
    if (bodyData.name == null) {
      return res.status(401).send({ error: true, msg: "body data missing" });
    }
    //check if the data exist already
    const findExist = existData.find((item) => item.name === bodyData.name);
    if (findExist) {
      return res.status(409).send({ error: true, msg: "data already exist" });
    }
    //append the user data
    const getLastId = existData
      .map((item) => item.id)
      .reduce((a, b) => Math.max(a, b));
    bodyData.id = getLastId + 1;
    existData.push(bodyData);

    //save the new user data
    this.saveData(existData);
    res.send({ success: true, msg: "data added successfully" });
  }
  // UPDATE
  update(req, res) {
    //get the update data
    const bodyData = req.body;
    //get the existing data
    const existData = this.getData();
    //check if the data exist or not
    const findExist = existData.find((item) => item.id === bodyData.id);

    if (!findExist) {
      return res.status(409).send({ error: true, msg: "data not exist" });
    }
    const updateData = existData.map((item) => {
      if (item.id === bodyData.id) {
        item.name = bodyData.name;
      }
      return item;
    });
    //finally save it
    this.saveData(updateData);
    res.send({ success: true, msg: "data updated successfully" });
  }
  // DELETE
  delete(req, res) {
    const paramId = req.params.id;
    //get the existing data
    const existData = this.getData();
    //filter the userdata to remove it

    const filterData = existData.filter(
      (item) => parseFloat(item.id) !== parseFloat(paramId)
    );
    if (existData.length === filterData.length) {
      return res.status(409).send({ error: true, msg: "data does not exist" });
    }
    //save the filtered data
    this.saveData(filterData);
    res.send({ success: true, msg: "data removed successfully" });
  }
}

module.exports = Core;
