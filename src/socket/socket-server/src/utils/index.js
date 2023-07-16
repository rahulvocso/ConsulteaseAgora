import pino from 'pino';

const Utils = {
  io: null,
  logger: pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
  // logger: pino({
  //   prettyPrint: true, // Enable pretty printing of log messages
  // }),
};

export default Utils;
