import { cpus } from 'os';
import cluster from 'cluster';
import { DB, db } from './db';
import { SingleServer } from './server';

const { pid } = process;

const start = async (db: DB) => {
  const numCpus = cpus().length;

  if (cluster.isPrimary) {
    console.log(`Primary ${pid} запущен`);

    for (let i = 0; i < numCpus; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Воркер с pid= ${worker.process.pid} умер`);
    });
  } else {
    const server = new SingleServer(db);
    console.log(`Воркер с pid= ${process.pid} запущен`);
  }
};

start(db);
