/* eslint-env jest */
process.env.DATABASE_URL = 'sqlite::memory:';
process.env.CLIENT_ID = 'fakeclientid';

const fs = require('fs');
const nock = require('nock');
const MockDate = require('mockdate');
const db = require('./lib/db');
const models = require('./models');

if (process.env.JEST_NOCK_RECORD === 'true') {
  const appendLogToFile = (content) => {
    fs.appendFile('nock.txt', content);
  };
  nock.recorder.rec({
    logging: appendLogToFile,
  });
} else {
  process.env.BOT_TOKEN = 'faketoken';
}

beforeEach(async () => {
  nock.cleanAll();
  nock.disableNetConnect();
  MockDate.set(1585952859 * 1000);
  await db.sync();
  for (const model of Object.values(models)) {
    await model.sync();
    await model.destroy({ where: {}, truncate: true });
  }
});
// afterAll(() => db.close());
