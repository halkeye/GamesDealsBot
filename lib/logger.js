const fs = require('fs');
const path = require('path');
const pino = require('pino-multi-stream');
const mkdirp = require('mkdirp');

const streams = [
  { stream: process.stdout },
];

if (process.env.LOG_FILE) {
  const logsDir = path.resolve(__dirname, '..', 'log');
  mkdirp(logsDir);
  streams.push({
    stream: fs.createWriteStream(
      path.resolve(logsDir, path.basename(process.env.LOG_FILE)),
    ),
  });
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.multistream(streams));

module.exports = logger;
