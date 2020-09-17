const moment = require('moment');
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

function timestamp(createdAt) {
  const date = new Date(createdAt);
  return moment(date).format('YYYY-MM-DD');
}

Deal.prototype.createMessage = function createMessage() {
  return [
    `**:calendar: Date:** ${timestamp(this.createdAt)}`,
    `**:question: Original Post:** <https://reddit.com/${this.thread_id}> by ${this.author}`,
    `**:video_game: Title:** ${this.title}`,
    `**:mouse_three_button: URL:** ${this.url}`,
  ].join('\n');
};

module.exports = Deal;
