import request from 'supertest';
import { v4 } from 'uuid';
import { createServer } from 'http';

import { db } from './db';
import { App } from './app';
import { IUser } from './interface/IUser';

const app = new App(db);

describe('Test crud methods', () => {
  const serverTest = createServer((req, res) => app.onRequest(req, res));
  let id = v4();
  let createdUser: IUser = null;

  afterAll(() => serverTest.close());
  test('should respond with a 200 status code and empty array', async () => {
    const response = await request(serverTest).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  test('should respond with a 404 status code', async () => {
    const response = await request(serverTest).get(`/api/users/${id}`);

    expect(response.status).toBe(404);
  });
  test('should return newly created record', async () => {
    const newUser = {
      username: 'Tom',
      age: 25,
      hobbies: ['dance']
    };
    const response = await request(serverTest).post('/api/users').send(newUser);

    id = response.body.id;

    createdUser = { ...newUser, id: id };

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdUser);
  });
  test('should respond with a 200 status code and one record', async () => {
    const response = await request(serverTest).get(`/api/users/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdUser);
  });
  test('should respond with a 200 status code and updated record', async () => {
    const updateUser: any = {
      username: 'John',
      age: 27
    };

    const response = await request(serverTest).put(`/api/users/${id}`).send(updateUser);

    const updatedUser = { ...createdUser, ...updateUser };

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });
  test('should respond with a 204 status code', async () => {
    const response = await request(serverTest).delete(`/api/users/${id}`);

    expect(response.status).toBe(204);
  });
  test('should respond with a 200 status code and empty array', async () => {
    const response = await request(serverTest).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  test('should respond with a 404 status code', async () => {
    const response = await request(serverTest).get(`/api/users/${id}`);

    expect(response.status).toBe(404);
  });
});
