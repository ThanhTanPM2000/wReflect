import Pino from 'pino';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const logger = Pino({
  level: LOG_LEVEL,
  prettyPrint: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  },
});

export default logger;
