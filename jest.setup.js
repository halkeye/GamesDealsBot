/* eslint-env jest */
process.env.DATABASE_URL = 'sqlite::memory:';


const MockDate = require('mockdate');
const db = require('./lib/db');
const models = require('./models');

beforeEach(async () => {
  MockDate.set(1585952859 * 1000);
  await db.sync();
  for (const model of Object.values(models)) {
    await model.sync();
    await model.destroy({ where: {}, truncate: true });
  }
});
afterAll(() => db.close());
