module.exports = app => {
  const controllers = require("../controllers/controller.js");
  var router = require("express").Router();

  router.post("/new-user", controllers.create);
  router.get("/users", controllers.findAll);
  router.get("/users/:id", controllers.findOne);
  router.put("/users/:id", controllers.update);
  router.delete("/users/:id", controllers.delete);
  router.delete("/users", controllers.deleteAll);
  
  app.use('/api/v1/', router);
};
