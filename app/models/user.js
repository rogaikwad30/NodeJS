module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("user", {
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    phone_number: {
      type: Sequelize.STRING(10)
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return user;
};
