const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'Games Deals',
  level: process.env.LOG_LEVEL || 'info',
});
if (process.env.LOG_FILE) {
  const logsDir = path.resolve(__dirname, '..', 'log');
  mkdirp(logsDir);
  logger.addStream({
    name: 'logFile',
    stream: fs.createWriteStream(
      path.resolve(logsDir, path.basename(process.env.LOG_FILE)),
    ),
  });
}

module.exports = logger;
