const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.phone_number) {
    res.status(400).send({
      error: "Missing required details"
    });
    return;
  }

  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email : req.body.email,
    phone_number: req.body.phone_number,
    status: "active"
  };

  User.create(newUser)
    .then(data => {
      res.status(200).json({
        "message" : "user registered succesfully",
        "data" : data
      });
    })
    .catch(err => {
      if (err.parent.code == "ER_DUP_ENTRY"){
        res.status(500).send({
          error:
            "Email already taken"
        });
      }
      else{
        res.status(500).send({
          error:
            err.message || "Some error occurred while creating the User."
        });
      }
    });
};

exports.findAll = (req, res) => {
  const fields = [ 'firstname', 'lastname' , 'email', 'phone_number', 'status', 'id'];
  let where = {};

  for (let i of fields){
    if(i in req.query){
      where[i] = {
        [Op.like]: `%${req.query[i]}%`
      };
    }
  }

  User.findAndCountAll({ where: where })
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).json({
          message : "success",
          user : data
        });
      } else {
        res.status(404).send({
          message: `Cannot find User with id = ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id = " + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const fields = [ 'firstname', 'lastname' , 'phone_number', 'status'];
  const data = {};

  for (let i of fields){
    if(i in req.body){
      if (i=="status"){
        if(req.body[i] in ["active","delete","disabled"]){
          data[i] = req.body[i];
          continue;
        }
        data[i] = req.body[i];
      }
    }
  }

  User.update(data, {
    where: { id: id, status: "active" }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
          updated_fields : data
        });
      } else {
        res.send({
          message: `Cannot update User with id = ${id} and status = active. Maybe User was not found or user is disabled or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  const data = { status  : "deleted" }

  User.update(data, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully."
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting User with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  const data = { status : "deleted" }
  User.update(data, {
    where: {}
  })
    .then(num => {
      res.send({
        message: `All - ${num} users were deleted successfully.`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting Users",
        error : error.message
      });
    });
};