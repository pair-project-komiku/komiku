'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comic.belongsTo(models.User, {foreignKey:'UserId'})
      Comic.belongsTo(models.Type, {foreignKey: 'TypeId'})
    }
  }
  Comic.init({
    title: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    TypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comic',
  });
  return Comic;
};