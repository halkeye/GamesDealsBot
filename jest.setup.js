/* eslint-env jest */
process.env.DATABASE_URL = 'sqlite::memory:';


const MockDate = require('mockdate');
const db = require('./lib/db');
const Webhook = require('./models/Webhook');
const Deal = require('./models/Deal');

beforeEach(async () => {
  MockDate.set(1585952859 * 1000);
  await db.sync();
  await Webhook.sync();
  await Deal.sync();
  await Webhook.destroy({ where: {}, truncate: true });
  await Deal.destroy({ where: {}, truncate: true });
});
afterAll(() => db.close());
