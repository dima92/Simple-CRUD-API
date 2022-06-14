import http from 'http';
import { DB } from './db';

export class App {
  private db: DB;

  endpointPost: {
    id: RegExp | null;
    path: RegExp;
    method: (request: http.IncomingMessage, response: http.ServerResponse, id?: string) => void;
  }[];

  private endpointGet: {
    id: RegExp | null;
    path: RegExp;
    method: (request: http.IncomingMessage, response: http.ServerResponse, id?: string) => void;
  }[];

  private endpointPut: {
    id: RegExp | null;
    path: RegExp;
    method: (request: http.IncomingMessage, response: http.ServerResponse, id?: string) => void;
  }[];

  private endpointDelete: {
    id: RegExp | null;
    path: RegExp;
    method: (request: http.IncomingMessage, response: http.ServerResponse, id?: string) => void;
  }[];

  constructor(db: DB) {
    this.db = db;

    this.endpointPost = [
      {
        id: null,
        path: /^\/api\/users$/,
        method: this.addUser.bind(this)
      }
    ];

    this.endpointGet = [
      {
        id: null,
        path: /^\/api\/users$/,
        method: this.getUsers.bind(this)
      },
      {
        id: /^[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        path: /^\/api\/users\/[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        method: this.getUser.bind(this)
      }
    ];

    this.endpointPut = [
      {
        id: /^[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        path: /^\/api\/users\/[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        method: this.updateUser.bind(this)
      }
    ];

    this.endpointDelete = [
      {
        id: /^[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        path: /^\/api\/users\/[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        method: this.deleteUser.bind(this)
      }
    ];
  }

  checkIdValidity(id: string, regex: RegExp | null) {
    if (!regex) return true;
    return id.match(regex);
  }

  nonExistance(req: http.IncomingMessage, res: http.ServerResponse) {
    res.statusCode = 404;
    res.write(`The endpoint ${decodeURI(<string>req.url)} does not exists`);
    res.end();
  }

  getRequestId(input: string) {
    return decodeURI(input)
      .replace('/api/users', '')
      .replace('/', '')
      .replace('$', '')
      .replace('{', '')
      .replace('}', '');
  }

  async getUsers(req: http.IncomingMessage, res: http.ServerResponse, id = '') {
    try {
      const users = await this.db.getUsers();

      res.statusCode = 200;
      res.write(JSON.stringify(users));
      res.end();
    } catch (e) {
      res.statusCode = 500;
      res.write(JSON.stringify({ error: 'Server error' }));
      res.end();
    }
  }

  async getUser(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
    try {
      const user = await this.db.getUser(id);

      if (!user) {
        res.statusCode = 404;
        res.write(JSON.stringify({ error: 'Record does not exist' }));
        res.end();
      } else {
        res.statusCode = 200;
        res.write(JSON.stringify(user));
        res.end();
      }
    } catch (e) {
      res.statusCode = 500;
      res.write(JSON.stringify({ error: 'Server error' }));
      res.end();
    }
  }

  async addUser(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const { data, err } = await this.db.addUser(JSON.parse(body));
        if (err) {
          res.statusCode = 404;
          res.write(JSON.stringify({ err }));
          res.end();
        } else {
          res.statusCode = 201;
          res.write(JSON.stringify(data));
          res.end();
        }
      });
    } catch (e) {
      res.statusCode = 500;
      res.write(JSON.stringify({ error: 'Server error' }));
      res.end();
    }
  }

  async updateUser(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const { user, err } = await this.db.updateUser(id, JSON.parse(body));
        if (err) {
          res.statusCode = 404;
          res.write(JSON.stringify({ error: 'Record does not exist' }));
          res.end();
        } else {
          res.statusCode = 200;
          res.write(JSON.stringify(user));
          res.end();
        }
      });
    } catch (e) {
      res.statusCode = 500;
      res.write(JSON.stringify({ error: 'Server error' }));
      res.end();
    }
  }

  async deleteUser(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
    try {
      const result = await this.db.deleteUser(id);
      if (!result) {
        res.statusCode = 404;
        res.write(JSON.stringify({ error: 'Record does not exist' }));
        res.end();
      } else {
        res.statusCode = 204;
        res.end();
      }
    } catch (e) {
      res.statusCode = 500;
      res.write(JSON.stringify({ error: 'Server error' }));
      res.end();
    }
  }

  onGetMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = this.getRequestId(<string>req.url);
    const found = this.endpointGet.find((item) => decodeURI(<string>req.url).match(item.path));

    if (!found) {
      this.nonExistance(req, res);
    } else {
      const isIdValid = this.checkIdValidity(id, found.id);
      if (!isIdValid) {
        res.statusCode = 400;
        res.write(JSON.stringify({ error: `User Id is invalid` }));
        res.end();
      } else {
        found.method(req, res, id);
      }
    }
  }

  onPostMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = this.getRequestId(<string>req.url);
    const found = this.endpointPost.find((item) => decodeURI(<string>req.url).match(item.path));

    if (!found) {
      this.nonExistance(req, res);
    } else {
      const isIdValid = this.checkIdValidity(id, found.id);
      found.method(req, res);
    }
  }

  onPutMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = this.getRequestId(<string>req.url);
    const found = this.endpointPut.find((item) => decodeURI(<string>req.url).match(item.path));

    if (!found) {
      this.nonExistance(req, res);
    } else {
      const isIdValid = this.checkIdValidity(id, found.id);
      if (!isIdValid) {
        res.statusCode = 400;
        res.write(JSON.stringify({ error: `User Id is invalid` }));
        res.end();
      } else {
        found.method(req, res, id);
      }
    }
  }

  onDeleteMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    const id = this.getRequestId(<string>req.url);
    const found = this.endpointDelete.find((item) => decodeURI(<string>req.url).match(item.path));

    if (!found) {
      this.nonExistance(req, res);
    } else {
      const isIdValid = this.checkIdValidity(id, found.id);
      if (!isIdValid) {
        res.statusCode = 400;
        res.write(JSON.stringify({ error: `User Id is invalid` }));
        res.end();
      } else {
        found.method(req, res, id);
      }
    }
  }

  onRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    res.setHeader('Content-Type', 'application/json');

    switch (req.method) {
      case 'POST':
        this.onPostMethod(req, res);
        break;
      case 'GET':
        this.onGetMethod(req, res);
        break;
      case 'PUT':
        this.onPutMethod(req, res);
        break;
      case 'DELETE':
        this.onDeleteMethod(req, res);
        break;
    }
  }
}
