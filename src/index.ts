import { db } from './db';
import { SingleServer } from './server';

const server = new SingleServer(db);
