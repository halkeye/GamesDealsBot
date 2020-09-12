const isURL = require('validator/lib/isURL');
const Sequelize = require('sequelize');
const database = require('../lib/db.js');

const Deal = database.define(
  'deals',
  {
    thread_id: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      primary: true,
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
      // set: (value) => {
      //   console.log({ value, a: value.trim() });
      //   return value.trim();
      // },
    },
    author: {
      type: Sequelize.TEXT,
      allowNull: false,
      // set: (value) => {
      //   console.log({ value, a: value.trim() });
      //   return value.trim();
      // },
    },
    url: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate(value) {
        if (!isURL(value)) {
          throw new Error('URL is invalid');
        }
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['thread_id'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  },
);

Deal.getLastDeal = () => Deal.findOne({
  order: [['createdAt', 'DESC']],
});

module.exports = Deal;
