import pino from 'pino';
import isEmpty from './isEmpty';
import useOrientation from './useOrientation';

const Utils = {
  socket: null,
  logger: pino(),
  isEmpty,
  useOrientation,
};

export default Utils;
