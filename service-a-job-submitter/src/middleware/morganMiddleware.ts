import morgan from 'morgan';
import logger from '../lib/logger.js';

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
});

export default morganMiddleware;
