'use strict';
module.exports = {
   up(queryInterface, Sequelize) {
    return queryInterface.createTable('Comics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      imgUrl: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
        references:{
          model: {
            tableName:'Users'
          },
          key: 'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      TypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName:'Types'
          },
          key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
   down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Comics');
  }
};