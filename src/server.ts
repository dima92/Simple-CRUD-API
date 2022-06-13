import { createServer } from 'http';
import { db } from './db';

const { pid } = process;
const PORT = process.env.PORT || 5000;
const app = new App(db);
const server = createServer((req, res) => {
  app.onRequest(req, res);
  console.log(`process id: ${pid} got a message`);
});
server.listen(PORT, () => {
  console.log(`Server started on ${PORT}, process.id: ${pid}`);
});
