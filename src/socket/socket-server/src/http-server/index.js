import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import config from '../../config';
import Utils from '../utils';

const app = express();
const server = createServer(app);

const init = () => {
  app.use(cors());
  server.listen(config.PORT, () => {
    Utils.logger.info(`http server listening on port ${config.PORT}`);
  });
};

const HTTPServer = {
  init,
  app,
  server,
};

export default HTTPServer;
