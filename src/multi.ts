import { cpus } from 'os';
import cluster from 'cluster';

const { pid } = process;

const start = async () => {
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
    await import ('./server');
    console.log(`Воркер с pid= ${process.pid} запущен`);
  }
};

start();
