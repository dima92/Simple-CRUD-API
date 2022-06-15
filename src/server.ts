import { createServer } from 'http';
import { db } from './db';
import config from './config';
import { App } from './app';

const { pid } = process;

const HOST = config.HOST || 'localhost';
const PORT = config.PORT || 5000;

const app = new App(db);

const server = createServer((req, res) => {
  app.onRequest(req, res);
  console.log(`process id: ${pid} got a message`);
});

// @ts-ignore
server.listen(PORT, HOST, () =>
  console.log(`Server started on ${HOST}:${PORT}, process.id: ${pid}`));

