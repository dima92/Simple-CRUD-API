import http from 'http';
import { DB } from './db';

export class App {
  private db: DB;

  endPointPost: {
    id: RegExp | null;
    path: RegExp;
    method: (req: http.IncomingMessage, res: http.ServerResponse, id?: string) => void
  }[];

  private endPointGet: {
    id: RegExp | null;
    path: RegExp;
    method: (req: http.IncomingMessage, res: http.ServerResponse, id?: string) => void
  }[];

  private endPointPut: {
    id: RegExp | null;
    path: RegExp;
    method: (req: http.IncomingMessage, res: http.ServerResponse, id?: string) => void
  }[];

  private endPointDelete: {
    id: RegExp | null;
    path: RegExp;
    method: (req: http.IncomingMessage, res: http.ServerResponse, id?: string) => void
  }[];

  constructor(db: DB) {
    this.db = db;

    this.endPointPost = [
      {
        id: null,
        path: /^\/api\/users$/,
        method: this.addUser.bind(this)
      }
    ];

    this.endPointGet = [
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

    this.endPointPut = [
      {
        id: /^[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        path: /^\/api\/users\/[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        method: this.updateUser.bind(this)
      }
    ];

    this.endPointDelete = [
      {
        id: /^[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        path: /^\/api\/users\/[\dA-Fa-f]{8}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{4}-[\dA-Fa-f]{12}$/,
        method: this.deleteUser.bind(this)
      }
    ];
  }

  getRequestId(input: string) {
    return decodeURI(input)
      .replace('/api/users', '')
      .replace('/', '')
      .replace('$', '')
      .replace('{', '')
      .replace('}', '');
  }

  onGetMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    throw new Error('Method not implemented.');
  }

  onPostMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    throw new Error('Method not implemented.');
  }

  onPutMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    throw new Error('Method not implemented.');
  }

  onDeleteMethod(req: http.IncomingMessage, res: http.ServerResponse) {
    throw new Error('Method not implemented.');
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
