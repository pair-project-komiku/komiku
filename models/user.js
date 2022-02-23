'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey:'UserId'})
      User.hasMany(models.Comic, {foreignKey:'UserId'})
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(att, options) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(att.password, salt)
        att.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};